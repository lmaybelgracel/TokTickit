import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Administrator User Management API Suite - ADM-01 to ADM-04 (Sprint 3 - Issue 22 & 23)", () => {
  const adminUser = {
    userId: 1,
    email: "admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    mustChangePassword: false,
  };

  const adminWithPasswordChangeUser = {
    userId: 2,
    email: "admin2@toktickit.com",
    role: Role.ADMINISTRATOR,
    mustChangePassword: true,
  };

  const staffUser = {
    userId: 10,
    email: "somchai.it@toktickit.com",
    role: Role.IT_STAFF,
    mustChangePassword: false,
  };

  const requesterUser = {
    userId: 20,
    email: "alice@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const adminToken = generateToken(adminUser);
  const adminMustChangeToken = generateToken(adminWithPasswordChangeUser);
  const staffToken = generateToken(staffUser);
  const requesterToken = generateToken(requesterUser);

  const sampleUsers = [
    {
      id: 1,
      name: "Suda Administrator",
      email: "admin@toktickit.com",
      role: Role.ADMINISTRATOR,
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date("2026-09-01T00:00:00Z"),
      updatedAt: new Date("2026-09-01T00:00:00Z"),
    },
    {
      id: 10,
      name: "Somchai Staff",
      email: "somchai.it@toktickit.com",
      role: Role.IT_STAFF,
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date("2026-09-01T00:00:00Z"),
      updatedAt: new Date("2026-09-01T00:00:00Z"),
    },
    {
      id: 20,
      name: "Alice Requester",
      email: "alice@example.com",
      role: Role.REQUESTER,
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date("2026-09-01T00:00:00Z"),
      updatedAt: new Date("2026-09-01T00:00:00Z"),
    },
  ];

  let mockPrisma: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma = {
      user: {
        findMany: vi.fn().mockResolvedValue(sampleUsers),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("Security & Role-Based Access Control", () => {
    it("returns 401 Unauthorized when no Authorization token is provided", async () => {
      const res = await request(app).get("/api/admin/users");
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Authentication required/i);
    });

    it("returns 403 Forbidden when accessed by a REQUESTER role", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Access denied: insufficient permissions/i);
    });

    it("returns 403 Forbidden when accessed by an IT_STAFF role", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Access denied: insufficient permissions/i);
    });

    it("returns 403 Forbidden when administrator has mustChangePassword = true", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminMustChangeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
    });

    it("returns 200 OK when accessed by an authorized ADMINISTRATOR", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/admin/users - User Listing & Filtering", () => {
    it("returns list of users with passwordHash omitted", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      for (const u of res.body) {
        expect(u.passwordHash).toBeUndefined();
        expect(u).toHaveProperty("id");
        expect(u).toHaveProperty("name");
        expect(u).toHaveProperty("email");
        expect(u).toHaveProperty("role");
        expect(u).toHaveProperty("isActive");
      }
    });

    it("applies search query parameter to find users by name or email", async () => {
      await request(app)
        .get("/api/admin/users?search=somchai")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: "somchai", mode: "insensitive" } },
              { email: { contains: "somchai", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    it("filters users by role", async () => {
      await request(app)
        .get("/api/admin/users?role=IT_STAFF")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: Role.IT_STAFF,
          }),
        })
      );
    });

    it("filters users by active status", async () => {
      await request(app)
        .get("/api/admin/users?isActive=true")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });
  });

  describe("POST /api/admin/users - Create User Account", () => {
    it("rejects creation when full name is missing or too short", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: " ",
          email: "valid@toktickit.com",
          role: "IT_STAFF",
          initialPassword: "StrongPassword123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Full name must be at least 2 characters/i);
    });

    it("rejects creation when email format is invalid", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Doe",
          email: "not-an-email",
          role: "IT_STAFF",
          initialPassword: "StrongPassword123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Valid email address is required/i);
    });

    it("rejects creation when role is invalid", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Doe",
          email: "john@toktickit.com",
          role: "SUPER_ADMIN",
          initialPassword: "StrongPassword123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Role must be one of/i);
    });

    it("rejects creation when initial password fails complexity rules", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Doe",
          email: "john@toktickit.com",
          role: "IT_STAFF",
          initialPassword: "short",
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/Password does not meet complexity requirements/i);
      expect(res.body.details).toBeDefined();
    });

    it("ADM-01: enforces BR-10: returns 409 Conflict if email is already registered", async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: 99, email: "john@toktickit.com" });

      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Doe",
          email: "john@toktickit.com",
          role: "IT_STAFF",
          initialPassword: "StrongPassword123!",
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already registered/i);
    });

    it("creates user successfully with mustChangePassword = true", async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 50,
        name: "John Doe",
        email: "john@toktickit.com",
        role: Role.IT_STAFF,
        isActive: true,
        mustChangePassword: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Doe",
          email: "john@toktickit.com",
          role: "IT_STAFF",
          initialPassword: "StrongPassword123!",
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(50);
      expect(res.body.mustChangePassword).toBe(true);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "john@toktickit.com",
            role: Role.IT_STAFF,
            mustChangePassword: true,
          }),
        })
      );
    });
  });

  describe("PATCH /api/admin/users/:id - Update User & Safety Rules", () => {
    it("returns 404 when target user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/admin/users/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Name" });

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/User not found/i);
    });

    it("ADM-02: enforces BR-07: returns 400 Bad Request if admin tries to deactivate own account", async () => {
      // adminUser has id: 1
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: "Suda Administrator",
        email: "admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });

      const res = await request(app)
        .patch("/api/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Administrators cannot deactivate their own account/i);
    });

    it("enforces BR-08: returns 400 Bad Request if admin tries to change own role away from ADMINISTRATOR", async () => {
      // adminUser has id: 1
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: "Suda Administrator",
        email: "admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });

      const res = await request(app)
        .patch("/api/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "IT_STAFF" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Administrators cannot change their own role/i);
    });

    it("ADM-03: enforces BR-09: returns 400 Bad Request if deactivating the last active Administrator", async () => {
      // Another admin target (id: 2), but activeAdminCount is 1
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 2,
        name: "Other Admin",
        email: "other.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });
      mockPrisma.user.count.mockResolvedValue(1);

      const res = await request(app)
        .patch("/api/admin/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Cannot deactivate the last active Administrator/i);
    });

    it("enforces BR-09: returns 400 Bad Request if demoting the last active Administrator", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 2,
        name: "Other Admin",
        email: "other.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });
      mockPrisma.user.count.mockResolvedValue(1);

      const res = await request(app)
        .patch("/api/admin/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "REQUESTER" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Cannot demote the last active Administrator/i);
    });

    it("allows deactivating an administrator when multiple active administrators exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 2,
        name: "Other Admin",
        email: "other.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });
      mockPrisma.user.count.mockResolvedValue(2); // 2 active admins
      mockPrisma.user.update.mockResolvedValue({
        id: 2,
        name: "Other Admin",
        email: "other.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: false,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .patch("/api/admin/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.isActive).toBe(false);
    });

    it("enforces BR-10: returns 409 Conflict if new email collides with another user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 10,
        name: "Somchai Staff",
        email: "somchai@toktickit.com",
        role: Role.IT_STAFF,
        isActive: true,
      });
      mockPrisma.user.findFirst.mockResolvedValue({ id: 20, email: "alice@example.com" });

      const res = await request(app)
        .patch("/api/admin/users/10")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "alice@example.com" });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already in use/i);
    });

    it("updates user details successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 10,
        name: "Somchai Staff",
        email: "somchai@toktickit.com",
        role: Role.IT_STAFF,
        isActive: true,
      });
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.update.mockResolvedValue({
        id: 10,
        name: "Somchai Promoted",
        email: "somchai.promoted@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .patch("/api/admin/users/10")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Somchai Promoted",
          email: "somchai.promoted@toktickit.com",
          role: "ADMINISTRATOR",
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Somchai Promoted");
      expect(res.body.role).toBe(Role.ADMINISTRATOR);
    });
  });

  describe("POST /api/admin/users/:id/reset-password - Password Reset", () => {
    it("returns 404 when target user is not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/admin/users/999/reset-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ newInitialPassword: "NewStrongPassword123!" });

      expect(res.status).toBe(404);
    });

    it("returns 422 if new initial password fails complexity requirements", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 10, email: "somchai@toktickit.com" });

      const res = await request(app)
        .post("/api/admin/users/10/reset-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ newInitialPassword: "weak" });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/Password does not meet complexity requirements/i);
    });

    it("resets password, updates hash, and forces mustChangePassword = true", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 10, email: "somchai@toktickit.com" });
      mockPrisma.user.update.mockResolvedValue({ id: 10 });

      const res = await request(app)
        .post("/api/admin/users/10/reset-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ newInitialPassword: "NewStrongPassword123!" });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Password reset successfully/i);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 10 },
          data: expect.objectContaining({
            mustChangePassword: true,
          }),
        })
      );
    });
  });
});
