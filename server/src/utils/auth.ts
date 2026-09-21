import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export const JWT_SECRET = process.env.JWT_SECRET || "toktickit-insecure-dev-secret-key-change-in-prod";
const TOKEN_EXPIRY = "24h";

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: Role;
  mustChangePassword: boolean;
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}
