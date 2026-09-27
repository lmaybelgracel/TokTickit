import { Router, Request, Response } from "express";
import { Role, Prisma } from "@prisma/client";
import { getPrisma } from "../prisma.js";
import { requireAuth, enforcePasswordChange, requireRole } from "../middleware/auth.middleware.js";
import { validatePasswordComplexity, hashPassword } from "../utils/password.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(enforcePasswordChange);
adminRouter.use(requireRole(Role.ADMINISTRATOR));

// GET /api/admin/users - List users with search and role filter
adminRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const { search, role, isActive } = req.query;

    const where: Prisma.UserWhereInput = {};

    // Search query matching name or email (case-insensitive)
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    // Role filter
    if (role && typeof role === "string" && role.trim() !== "") {
      const upperRole = role.trim().toUpperCase();
      if (Object.values(Role).includes(upperRole as Role)) {
        where.role = upperRole as Role;
      }
    }

    // Active status filter
    if (isActive !== undefined && isActive !== "") {
      where.isActive = String(isActive) === "true";
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// POST /api/admin/users - Create new user account
adminRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const { name, email, role, initialPassword, isActive = true } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({ error: "Full name must be at least 2 characters" });
      return;
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: "Valid email address is required" });
      return;
    }

    const upperRole = typeof role === "string" ? role.trim().toUpperCase() : "";
    if (!Object.values(Role).includes(upperRole as Role)) {
      res.status(400).json({ error: "Role must be one of: REQUESTER, IT_STAFF, ADMINISTRATOR" });
      return;
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(initialPassword);
    if (!passwordValidation.isValid) {
      res.status(422).json({
        error: "Password does not meet complexity requirements",
        details: passwordValidation.errors,
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // BR-10: Check globally unique email address
    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });

    if (existing) {
      res.status(409).json({ error: "Email address is already registered in the system" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        role: upperRole as Role,
        passwordHash: hashPassword(initialPassword),
        mustChangePassword: true,
        isActive: isActive !== false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PATCH /api/admin/users/:id - Update user details and activation status
adminRouter.patch("/users/:id", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId) || targetId <= 0) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { name, email, role, isActive } = req.body;

    // BR-07: Administrator cannot deactivate their own account
    if (req.user!.id === targetId && isActive === false && targetUser.isActive === true) {
      res.status(400).json({ error: "Administrators cannot deactivate their own account" });
      return;
    }

    // BR-08: Administrator cannot change their own role away from ADMINISTRATOR
    if (
      req.user!.id === targetId &&
      role !== undefined &&
      role.toUpperCase() !== Role.ADMINISTRATOR &&
      targetUser.role === Role.ADMINISTRATOR
    ) {
      res.status(400).json({ error: "Administrators cannot change their own role away from ADMINISTRATOR" });
      return;
    }

    // BR-09: Prevent deactivating or demoting the last active Administrator
    if (targetUser.role === Role.ADMINISTRATOR && targetUser.isActive === true) {
      const willBeInactive = isActive === false;
      const willDemote = role !== undefined && role.toUpperCase() !== Role.ADMINISTRATOR;

      if (willBeInactive || willDemote) {
        const activeAdminCount = await prisma.user.count({
          where: { role: Role.ADMINISTRATOR, isActive: true },
        });

        if (activeAdminCount <= 1) {
          if (willBeInactive) {
            res.status(400).json({ error: "Cannot deactivate the last active Administrator" });
            return;
          }
          if (willDemote) {
            res.status(400).json({ error: "Cannot demote the last active Administrator" });
            return;
          }
        }
      }
    }

    // BR-10: Check globally unique email if updating email
    let normalizedEmail: string | undefined = undefined;
    if (email !== undefined && typeof email === "string") {
      normalizedEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        res.status(400).json({ error: "Valid email address is required" });
        return;
      }

      if (normalizedEmail !== targetUser.email.toLowerCase()) {
        const existingEmail = await prisma.user.findFirst({
          where: {
            id: { not: targetId },
            email: { equals: normalizedEmail, mode: "insensitive" },
          },
        });

        if (existingEmail) {
          res.status(409).json({ error: "Email address is already in use by another user" });
          return;
        }
      }
    }

    let upperRole: Role | undefined = undefined;
    if (role !== undefined && typeof role === "string") {
      const parsed = role.trim().toUpperCase();
      if (!Object.values(Role).includes(parsed as Role)) {
        res.status(400).json({ error: "Role must be one of: REQUESTER, IT_STAFF, ADMINISTRATOR" });
        return;
      }
      upperRole = parsed as Role;
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: {
        ...(name && typeof name === "string" ? { name: name.trim() } : {}),
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
        ...(upperRole ? { role: upperRole } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// POST /api/admin/users/:id/reset-password - Reset user password and force change
adminRouter.post("/users/:id/reset-password", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId) || targetId <= 0) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { newInitialPassword } = req.body;

    const validation = validatePasswordComplexity(newInitialPassword);
    if (!validation.isValid) {
      res.status(422).json({
        error: "Password does not meet complexity requirements",
        details: validation.errors,
      });
      return;
    }

    await prisma.user.update({
      where: { id: targetId },
      data: {
        passwordHash: hashPassword(newInitialPassword),
        mustChangePassword: true,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});
