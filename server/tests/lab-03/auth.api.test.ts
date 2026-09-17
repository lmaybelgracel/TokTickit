import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { hashPassword, validatePasswordComplexity } from "../../src/utils/password.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Authentication & Session API Suite (Sprint 3 - Issue 19)", () => {
  const defaultPassword = "Password123!";
  const defaultHash = hashPassword(defaultPassword);

  const activeUser = {
    id: 1,
    email: "pae.karn@example.com",
    name: "Pae Karn",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const inactiveUser = {
    id: 2,
    email: "inactive.staff@toktickit.com",
    name: "Inactive Staff",
    role: Role.IT_STAFF,
    isActive: false,
    mustChangePassword: false,
    passwordHash: defaultHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mustChangeUser = {
    id: 3,
    email: "miki.chan@example.com",
    name: "Miki Chan",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: true,
    passwordHash: defaultHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  describe("Password Complexity Validation Unit Tests", () => {
    it("rejects password shorter than 8 characters", () => {
      const result = validatePasswordComplexity("Pass1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long");
    });

    it("rejects password missing uppercase letter", () => {
      const result = validatePasswordComplexity("password123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
    });

    it("rejects password missing lowercase letter", () => {
      const result = validatePasswordComplexity("PASSWORD123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one lowercase letter");
    });

    it("rejects password missing numeric digit", () => {
      const result = validatePasswordComplexity("PasswordWithoutDigit!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one numeric digit");
    });

    it("accepts valid complex password", () => {
      const result = validatePasswordComplexity("SecurePassword123!");
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe("AUTH-01: Valid User Login", () => {
    it("authenticates active user with valid credentials, issuing JWT token and user profile", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(activeUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "pae.karn@example.com", password: defaultPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe("string");
      expect(res.body.user).toEqual({
        id: activeUser.id,
        email: activeUser.email,
        name: activeUser.name,
        role: activeUser.role,
        mustChangePassword: false,
      });
    });

    it("returns 400 Bad Request when email or password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "pae.karn@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Email and password are required");
    });
  });

  describe("AUTH-02: Login with Incorrect Password", () => {
    it("rejects invalid password with 401 Unauthorized without issuing token", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(activeUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "pae.karn@example.com", password: "WrongPassword999!" });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toBe("Invalid email or password");
    });
  });

  describe("AUTH-03: Login with Inactive User Account", () => {
    it("rejects inactive user with safe 401 Unauthorized message", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(inactiveUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "inactive.staff@toktickit.com", password: defaultPassword });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toBe("Invalid email or password");
    });

    it("rejects non-existent user with safe 401 Unauthorized message", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@toktickit.com", password: defaultPassword });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toBe("Invalid email or password");
    });
  });

  describe("AUTH-06: Logout API", () => {
    it("returns 200 OK confirming session termination", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/auth/me Profile API", () => {
    it("returns profile for authenticated user with valid Bearer token", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(activeUser);
      const token = generateToken({
        userId: activeUser.id,
        email: activeUser.email,
        role: activeUser.role,
        mustChangePassword: activeUser.mustChangePassword,
      });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(activeUser.email);
      expect(res.body.name).toBe(activeUser.name);
      expect(res.body.role).toBe(activeUser.role);
    });

    it("returns 401 Unauthorized when token is missing", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authentication required");
    });

    it("returns 401 Unauthorized when token is invalid or forged", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token-string");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authentication required");
    });
  });

  describe("AUTH-05: Password Change API", () => {
    it("updates password and clears mustChangePassword flag when given valid new password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser);
      mockPrisma.user.update.mockResolvedValue({
        ...mustChangeUser,
        mustChangePassword: false,
      });

      const token = generateToken({
        userId: mustChangeUser.id,
        email: mustChangeUser.email,
        role: mustChangeUser.role,
        mustChangePassword: mustChangeUser.mustChangePassword,
      });

      const res = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: defaultPassword,
          newPassword: "BrandNewSecurePassword123!",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password changed successfully");
      expect(res.body.mustChangePassword).toBe(false);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mustChangeUser.id },
          data: expect.objectContaining({
            mustChangePassword: false,
          }),
        })
      );
    });

    it("rejects password change if current password is wrong", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser);

      const token = generateToken({
        userId: mustChangeUser.id,
        email: mustChangeUser.email,
        role: mustChangeUser.role,
        mustChangePassword: mustChangeUser.mustChangePassword,
      });

      const res = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "IncorrectCurrentPassword1!",
          newPassword: "BrandNewSecurePassword123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Current password does not match");
    });

    it("rejects password change if new password is identical to current password (422)", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser);

      const token = generateToken({
        userId: mustChangeUser.id,
        email: mustChangeUser.email,
        role: mustChangeUser.role,
        mustChangePassword: mustChangeUser.mustChangePassword,
      });

      const res = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: defaultPassword,
          newPassword: defaultPassword,
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe("New password cannot be the same as current password");
    });

    it("rejects password change if new password does not meet complexity rules (422)", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser);

      const token = generateToken({
        userId: mustChangeUser.id,
        email: mustChangeUser.email,
        role: mustChangeUser.role,
        mustChangePassword: mustChangeUser.mustChangePassword,
      });

      const res = await request(app)
        .post("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: defaultPassword,
          newPassword: "weak",
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe("Password does not meet complexity requirements");
      expect(res.body.details).toBeDefined();
    });
  });
});
