import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyToken, AuthTokenPayload } from "../utils/auth.js";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  name?: string;
  mustChangePassword: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        mustChangePassword: payload.mustChangePassword,
      };
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

export function enforcePasswordChange(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.mustChangePassword) {
    res.status(403).json({
      error: "Password change required before accessing the application",
      mustChangePassword: true,
    });
    return;
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Access denied: insufficient permissions" });
      return;
    }

    next();
  };
}
