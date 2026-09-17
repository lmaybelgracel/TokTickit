import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Administrator User Management Traceability Suite - ADM-01 to ADM-04 (Sprint 3 - Issue 23)", () => {
  const adminUser = {
    userId: 1,
    email: "admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    mustChangePassword: false,
  };

  const adminToken = generateToken(adminUser);

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  describe("ADM-01: Admin creates user with duplicate email returns 409 Conflict (FR-19, BR-10)", () => {
    it("rejects user creation with 409 Conflict when email already exists", async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 5,
        email: "duplicate@toktickit.com",
      });

      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Account",
          email: "duplicate@toktickit.com",
          role: "IT_STAFF",
          initialPassword: "Password123!",
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBeDefined();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("ADM-02: Admin attempts to deactivate own account returns 400 Bad Request (BR-07)", () => {
    it("rejects administrator deactivating their own account with 400 Bad Request", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: "admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });

      const res = await request(app)
        .patch("/api/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          isActive: false,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("ADM-03: Admin deactivates or demotes last active Admin returns 400 Bad Request (AC-10, BR-09)", () => {
    it("rejects deactivating the last active administrator with 400 Bad Request", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 2,
        email: "sole.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });
      mockPrisma.user.count.mockResolvedValue(1);

      const res = await request(app)
        .patch("/api/admin/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          isActive: false,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it("rejects demoting the last active administrator with 400 Bad Request", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 2,
        email: "sole.admin@toktickit.com",
        role: Role.ADMINISTRATOR,
        isActive: true,
      });
      mockPrisma.user.count.mockResolvedValue(1);

      const res = await request(app)
        .patch("/api/admin/users/2")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          role: "IT_STAFF",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("ADM-04: Admin resets user initial password returns 200 OK and sets mustChangePassword = true (BR-11)", () => {
    it("successfully resets user password and forces mustChangePassword = true", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 10,
        email: "staff@toktickit.com",
        role: Role.IT_STAFF,
        isActive: true,
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 10,
        email: "staff@toktickit.com",
        role: Role.IT_STAFF,
        isActive: true,
        mustChangePassword: true,
      });

      const res = await request(app)
        .post("/api/admin/users/10/reset-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          newInitialPassword: "NewTempPassword123!",
        });

      expect(res.status).toBe(200);
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
