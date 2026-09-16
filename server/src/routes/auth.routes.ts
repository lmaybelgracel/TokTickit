import { Router, Request, Response } from "express";
import { getPrisma } from "../prisma.js";
import { generateToken } from "../utils/auth.js";
import { comparePassword, hashPassword, validatePasswordComplexity } from "../utils/password.js";
import { authenticateToken, requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const prisma = getPrisma();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordValid = comparePassword(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error during login" });
  }
});

// POST /api/auth/logout
authRouter.post("/logout", (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// GET /api/auth/me
authRouter.get("/me", authenticateToken, requireAuth, async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: "User session is no longer active" });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error fetching user profile" });
  }
});

// POST /api/auth/change-password
authRouter.post(
  "/change-password",
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current password and new password are required" });
        return;
      }

      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user || !user.isActive) {
        res.status(401).json({ error: "User not found or inactive" });
        return;
      }

      const isCurrentValid = comparePassword(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        res.status(400).json({ error: "Current password does not match" });
        return;
      }

      const complexityResult = validatePasswordComplexity(newPassword);
      if (!complexityResult.isValid) {
        res.status(400).json({
          error: "Password does not meet complexity requirements",
          details: complexityResult.errors,
        });
        return;
      }

      const newHash = hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          mustChangePassword: false,
        },
      });

      res.status(200).json({
        message: "Password changed successfully",
        mustChangePassword: false,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error changing password" });
    }
  }
);
