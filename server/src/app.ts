import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getPrisma } from "./prisma.js";

// The Express app is exported separately from app.listen() (see index.ts) so
// Supertest can import `app` without opening a port. Do not merge these files.
export const app = express();

app.use(cors());          // lets the Vite dev server call this API
app.use(express.json());

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf",
]);
const attachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ATTACHMENT_SIZE },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_ATTACHMENT_TYPES.has(file.mimetype)) callback(null, true);
    else callback(new Error("UNSUPPORTED_FILE_TYPE"));
  },
});
const uploadsDirectory = path.resolve(process.cwd(), "uploads");

function requesterIdFrom(req: Request): number | null {
  const value = req.headers["x-development-requester-id"];
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

// Issue 2 — API health check
app.get("/api/health", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.simulate_error === "true") {
    return next(new Error("Database connection failure"));
  }
  res.status(200).json({ status: "ok", service: "TokTickIT API" });
});

// Lab 2 — Issue 9: Development Requester list
app.get("/api/requesters", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const requesters = await prisma.requesterUser.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
      },
    });
    res.status(200).json(requesters);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve active Development Requesters",
      },
    });
  }
});

// Issue 4 — Category list
app.get("/api/categories", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true, description: true },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

// Lab 2 — Related Systems list
app.get("/api/related-systems", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const relatedSystems = await prisma.relatedSystem.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true, category: true },
    });
    res.status(200).json(relatedSystems);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve related systems",
      },
    });
  }
});

// Helper function to generate unique ticket number: TKT-YYYY-XXXXXX
function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TKT-${year}-${randomNum}`;
}

// Lab 2 — Issue 10: Create Ticket
app.post("/api/tickets", async (req: Request, res: Response) => {
  try {
    const requesterHeader = req.headers["x-development-requester-id"];
    if (!requesterHeader) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "X-Development-Requester-Id header is required",
        },
      });
    }

    const requesterId = parseInt(Array.isArray(requesterHeader) ? requesterHeader[0] : requesterHeader, 10);
    if (isNaN(requesterId)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid X-Development-Requester-Id header",
        },
      });
    }

    const prisma = getPrisma();

    // Verify Requester existence and isActive === true
    const requester = await prisma.requesterUser.findUnique({
      where: { id: requesterId },
    });

    if (!requester || !requester.isActive) {
      return res.status(422).json({
        error: {
          code: "INACTIVE_REQUESTER",
          message: "Selected Development Requester is inactive or does not exist.",
        },
      });
    }

    const { categoryId, relatedSystemId, requestedPriority, summary, description } = req.body || {};
    const details: { field: string; message: string }[] = [];

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      details.push({ field: "categoryId", message: "Category ID is required and must be a valid integer." });
    } else {
      const categoryObj = await prisma.category.findUnique({ where: { id: parsedCategoryId } });
      if (!categoryObj || !categoryObj.isActive) {
        details.push({ field: "categoryId", message: "Selected Category does not exist or is inactive." });
      }
    }

    const parsedRelatedSystemId = parseInt(relatedSystemId, 10);
    if (isNaN(parsedRelatedSystemId)) {
      details.push({ field: "relatedSystemId", message: "Related System ID is required and must be a valid integer." });
    } else {
      const systemObj = await prisma.relatedSystem.findUnique({ where: { id: parsedRelatedSystemId } });
      if (!systemObj || !systemObj.isActive) {
        details.push({ field: "relatedSystemId", message: "Selected Related System does not exist or is inactive." });
      }
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!requestedPriority || !validPriorities.includes(requestedPriority)) {
      details.push({ field: "requestedPriority", message: "Requested Priority must be LOW, MEDIUM, or HIGH." });
    }

    const trimmedSummary = typeof summary === "string" ? summary.trim() : "";
    if (trimmedSummary.length < 5 || trimmedSummary.length > 150) {
      details.push({ field: "summary", message: "Summary must be between 5 and 150 characters." });
    }

    const trimmedDescription = typeof description === "string" ? description.trim() : "";
    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
      details.push({ field: "description", message: "Description must be between 10 and 2000 characters." });
    }

    if (details.length > 0) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed for ticket creation.",
          details,
        },
      });
    }

    const ticketNumber = generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        summary: trimmedSummary,
        description: trimmedDescription,
        requestedPriority,
        currentStatus: "NEW",
        requesterId,
        categoryId: parsedCategoryId,
        relatedSystemId: parsedRelatedSystemId,
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Failed to create ticket",
      },
    });
  }
});

// Lab 2 — Issue 11: GET /api/tickets (Paginated ticket list owned by Requester)
app.get("/api/tickets", async (req: Request, res: Response) => {
  try {
    const requesterHeader = req.headers["x-development-requester-id"];
    if (!requesterHeader) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "X-Development-Requester-Id header is required",
        },
      });
    }

    const requesterId = parseInt(Array.isArray(requesterHeader) ? requesterHeader[0] : requesterHeader, 10);
    if (isNaN(requesterId)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid X-Development-Requester-Id header",
        },
      });
    }

    const prisma = getPrisma();

    // Verify Requester existence and isActive === true
    const requester = await prisma.requesterUser.findUnique({
      where: { id: requesterId },
    });

    if (!requester || !requester.isActive) {
      return res.status(422).json({
        error: {
          code: "INACTIVE_REQUESTER",
          message: "Selected Development Requester is inactive or does not exist.",
        },
      });
    }

    const { search, category, priority, status, sort, page, pageSize } = req.query;

    const where: any = {
      requesterId,
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      const term = search.trim();
      where.OR = [
        { ticketNumber: { contains: term, mode: "insensitive" } },
        { summary: { contains: term, mode: "insensitive" } },
      ];
    }

    const catId = category === undefined ? undefined : Number(category);
    if (category !== undefined && (!Number.isInteger(catId) || Number(catId) < 1)) {
      return res.status(400).json({ error: { code: "INVALID_QUERY", message: "category must be a positive integer." } });
    }
    if (catId) where.categoryId = catId;

    if (priority !== undefined && !["LOW", "MEDIUM", "HIGH"].includes(String(priority))) {
      return res.status(400).json({ error: { code: "INVALID_QUERY", message: "priority must be LOW, MEDIUM, or HIGH." } });
    }
    if (priority) where.requestedPriority = String(priority);

    if (status !== undefined && !["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(String(status))) {
      return res.status(400).json({ error: { code: "INVALID_QUERY", message: "status is invalid." } });
    }
    if (status) where.currentStatus = String(status);

    const validSorts: Record<string, { createdAt?: "asc" | "desc"; updatedAt?: "asc" | "desc" }> = {
      "createdAt:desc": { createdAt: "desc" }, "createdAt:asc": { createdAt: "asc" },
      "updatedAt:desc": { updatedAt: "desc" }, "updatedAt:asc": { updatedAt: "asc" },
    };
    const sortKey = sort === undefined ? "createdAt:desc" : String(sort);
    if (!validSorts[sortKey]) return res.status(400).json({ error: { code: "INVALID_QUERY", message: "sort value is invalid." } });

    const parsedPage = page === undefined ? 1 : Number(page);
    const parsedPageSize = pageSize === undefined ? 10 : Number(pageSize);
    if (!Number.isInteger(parsedPage) || parsedPage < 1 || ![5, 10, 25, 50].includes(parsedPageSize)) {
      return res.status(400).json({ error: { code: "INVALID_QUERY", message: "page must be a positive integer and pageSize must be 5, 10, 25, or 50." } });
    }
    const skip = (parsedPage - 1) * parsedPageSize;

    const [totalItems, tickets] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        orderBy: [validSorts[sortKey], { id: "desc" }],
        skip,
        take: parsedPageSize,
        include: {
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / parsedPageSize) || 1;

    return res.status(200).json({
      data: tickets,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Failed to retrieve tickets",
      },
    });
  }
});

// Lab 2 — Issue 12: owned ticket detail and attachment lifecycle
app.get("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    const requesterId = requesterIdFrom(req);
    const ticketId = Number(req.params.id);
    if (!requesterId || !Number.isInteger(ticketId) || ticketId < 1) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "A valid requester header and ticket id are required." } });
    }
    const ticket = await getPrisma().ticket.findUnique({
      where: { id: ticketId },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        attachments: { orderBy: { uploadedAt: "desc" } },
      },
    });
    if (!ticket) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Ticket not found." } });
    if (ticket.requesterId !== requesterId) {
      return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "You do not have permission to view this ticket." } });
    }
    return res.status(200).json(ticket);
  } catch {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to retrieve ticket." } });
  }
});

app.post("/api/tickets/:id/attachments", attachmentUpload.single("file"), async (req: Request, res: Response) => {
  try {
    const requesterId = requesterIdFrom(req);
    const ticketId = Number(req.params.id);
    if (!requesterId || !Number.isInteger(ticketId) || ticketId < 1 || !req.file) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "A valid requester, ticket id, and file are required." } });
    }
    const prisma = getPrisma();
    const requester = await prisma.requesterUser.findUnique({
      where: { id: requesterId },
      select: { isActive: true },
    });
    if (!requester || !requester.isActive) {
      return res.status(422).json({ error: { code: "INACTIVE_REQUESTER", message: "Selected Development Requester is inactive or does not exist." } });
    }
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, select: { requesterId: true } });
    if (!ticket) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Ticket not found." } });
    if (ticket.requesterId !== requesterId) return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "You do not have permission to modify this ticket." } });
    const activeCount = await prisma.attachment.count({ where: { ticketId, isRemoved: false } });
    if (activeCount >= 5) return res.status(400).json({ error: { code: "ATTACHMENT_LIMIT", message: "A ticket can have no more than 5 active attachments." } });

    await mkdir(uploadsDirectory, { recursive: true });
    const storedName = `${randomUUID()}${path.extname(req.file.originalname)}`;
    const storedPath = path.join(uploadsDirectory, storedName);
    await writeFile(storedPath, req.file.buffer);
    const attachment = await prisma.attachment.create({ data: {
      ticketId, filename: req.file.originalname, storedPath, fileSize: req.file.size, mimeType: req.file.mimetype,
    } });
    return res.status(201).json(attachment);
  } catch (error) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to upload attachment." } });
  }
});

app.get("/api/attachments/:id/download", async (req: Request, res: Response) => {
  try {
    const requesterId = requesterIdFrom(req);
    const attachmentId = Number(req.params.id);
    if (!requesterId || !Number.isInteger(attachmentId) || attachmentId < 1) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Valid requester and attachment ids are required." } });
    const attachment = await getPrisma().attachment.findUnique({ where: { id: attachmentId }, include: { ticket: { select: { requesterId: true } } } });
    if (!attachment) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Attachment not found." } });
    if (attachment.ticket.requesterId !== requesterId) return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "You do not have permission to download this attachment." } });
    if (attachment.isRemoved) return res.status(410).json({ error: { code: "ATTACHMENT_REMOVED", message: "This attachment has been removed and is no longer available for download." } });
    const data = await readFile(attachment.storedPath);
    res.setHeader("Content-Type", attachment.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${attachment.filename.replace(/["\r\n]/g, "_")}"`);
    return res.status(200).send(data);
  } catch {
    return res.status(404).json({ error: { code: "FILE_NOT_FOUND", message: "Attachment file is unavailable." } });
  }
});

app.delete("/api/attachments/:id", async (req: Request, res: Response) => {
  try {
    const requesterId = requesterIdFrom(req);
    const attachmentId = Number(req.params.id);
    const removalReason = typeof req.body?.removalReason === "string" ? req.body.removalReason.trim() : "";
    if (!requesterId || !Number.isInteger(attachmentId) || attachmentId < 1 || removalReason.length < 3 || removalReason.length > 250) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Removal reason must be between 3 and 250 characters." } });
    }
    const prisma = getPrisma();
    const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId }, include: { ticket: { select: { requesterId: true } } } });
    if (!attachment) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Attachment not found." } });
    if (attachment.ticket.requesterId !== requesterId) return res.status(403).json({ error: { code: "FORBIDDEN_ACCESS", message: "You do not have permission to remove this attachment." } });
    if (attachment.isRemoved) return res.status(409).json({ error: { code: "ALREADY_REMOVED", message: "Attachment has already been removed." } });
    const updated = await prisma.attachment.update({ where: { id: attachmentId }, data: { isRemoved: true, removedAt: new Date(), removalReason } });
    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to remove attachment." } });
  }
});

// Centralized error handling middleware
app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (_err instanceof multer.MulterError && _err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: { code: "FILE_TOO_LARGE", message: "Attachment must not exceed 5 MB." } });
  }
  if (_err?.message === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({ error: { code: "UNSUPPORTED_FILE_TYPE", message: "Only JPG, PNG, WEBP, and PDF files are allowed." } });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
