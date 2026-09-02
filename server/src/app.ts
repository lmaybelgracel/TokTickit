import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { getPrisma } from "./prisma.js";

// The Express app is exported separately from app.listen() (see index.ts) so
// Supertest can import `app` without opening a port. Do not merge these files.
export const app = express();

app.use(cors());          // lets the Vite dev server call this API
app.use(express.json());

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

// Centralized error handling middleware
app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
