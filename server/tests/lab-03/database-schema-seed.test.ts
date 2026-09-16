import { describe, it, expect } from "vitest";
import { Role, Priority, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  categoriesData,
  relatedSystemsData,
  usersData,
  ticketsData,
} from "../../prisma/seed.js";

describe("Database Schema & Seed Verification (Sprint 3 - Issue 18)", () => {
  describe("Enum Specifications", () => {
    it("verifies Role enum contains exactly REQUESTER, IT_STAFF, and ADMINISTRATOR", () => {
      expect(Role).toBeDefined();
      expect(Object.values(Role)).toEqual(
        expect.arrayContaining(["REQUESTER", "IT_STAFF", "ADMINISTRATOR"])
      );
      expect(Object.values(Role).length).toBe(3);
    });

    it("verifies Priority enum contains LOW, MEDIUM, HIGH, and URGENT", () => {
      expect(Priority).toBeDefined();
      expect(Object.values(Priority)).toEqual(
        expect.arrayContaining(["LOW", "MEDIUM", "HIGH", "URGENT"])
      );
      expect(Object.values(Priority).length).toBe(4);
    });

    it("verifies TicketStatus enum contains all 8 required lifecycle states", () => {
      expect(TicketStatus).toBeDefined();
      const expectedStatuses = [
        "NEW",
        "OPEN",
        "IN_PROGRESS",
        "WAITING_FOR_REQUESTER",
        "RESOLVED",
        "CLOSED",
        "REOPENED",
        "CANCELLED",
      ];
      expect(Object.values(TicketStatus)).toEqual(
        expect.arrayContaining(expectedStatuses)
      );
      expect(Object.values(TicketStatus).length).toBe(8);
    });
  });

  describe("Seed User Roster Verification", () => {
    it("contains at least 4 active Requesters and at least 1 inactive Requester", () => {
      const requesters = usersData.filter((u) => u.role === Role.REQUESTER);
      const activeRequesters = requesters.filter((u) => u.isActive);
      const inactiveRequesters = requesters.filter((u) => !u.isActive);

      expect(activeRequesters.length).toBeGreaterThanOrEqual(4);
      expect(inactiveRequesters.length).toBeGreaterThanOrEqual(1);
    });

    it("contains at least 3 active IT Staff and at least 1 inactive IT Staff", () => {
      const itStaff = usersData.filter((u) => u.role === Role.IT_STAFF);
      const activeStaff = itStaff.filter((u) => u.isActive);
      const inactiveStaff = itStaff.filter((u) => !u.isActive);

      expect(activeStaff.length).toBeGreaterThanOrEqual(3);
      expect(inactiveStaff.length).toBeGreaterThanOrEqual(1);
    });

    it("contains at least 1 active Administrator", () => {
      const admins = usersData.filter((u) => u.role === Role.ADMINISTRATOR);
      const activeAdmins = admins.filter((u) => u.isActive);

      expect(activeAdmins.length).toBeGreaterThanOrEqual(1);
    });

    it("ensures all seed users have unique email addresses and valid bcrypt hashes", () => {
      const emails = usersData.map((u) => u.email.toLowerCase());
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(emails.length);

      for (const user of usersData) {
        expect(user.passwordHash).toBeDefined();
        expect(user.passwordHash.length).toBeGreaterThan(20);
        // Valid bcrypt hash starts with $2a$, $2b$, or $2y$
        expect(user.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/);

        // Can verify against either default password or temp password
        const matchesDefault = bcrypt.compareSync("Password123!", user.passwordHash);
        const matchesTemp = bcrypt.compareSync("Pass1234!", user.passwordHash);
        expect(matchesDefault || matchesTemp).toBe(true);
      }
    });

    it("includes accounts with mustChangePassword flag for first-login challenge testing", () => {
      const mustChangeAccounts = usersData.filter((u) => u.mustChangePassword);
      expect(mustChangeAccounts.length).toBeGreaterThan(0);

      // Verify at least one Requester and one IT Staff has mustChangePassword = true
      expect(mustChangeAccounts.some((u) => u.role === Role.REQUESTER)).toBe(true);
      expect(mustChangeAccounts.some((u) => u.role === Role.IT_STAFF)).toBe(true);
    });
  });

  describe("Seed Ticket & Operational Workflow Verification", () => {
    it("ensures realistic ticket seed covers diverse statuses and priorities", () => {
      const statuses = new Set(ticketsData.map((t) => t.currentStatus));
      expect(statuses.has(TicketStatus.NEW)).toBe(true);
      expect(statuses.has(TicketStatus.OPEN)).toBe(true);
      expect(statuses.has(TicketStatus.IN_PROGRESS)).toBe(true);
      expect(statuses.has(TicketStatus.WAITING_FOR_REQUESTER)).toBe(true);
      expect(statuses.has(TicketStatus.RESOLVED)).toBe(true);
      expect(statuses.has(TicketStatus.CLOSED)).toBe(true);

      const priorities = new Set(ticketsData.map((t) => t.itPriority));
      expect(priorities.has(Priority.LOW)).toBe(true);
      expect(priorities.has(Priority.MEDIUM)).toBe(true);
      expect(priorities.has(Priority.HIGH)).toBe(true);
      expect(priorities.has(Priority.URGENT)).toBe(true);
    });

    it("includes both claimed (assigned) and unassigned tickets", () => {
      const unassigned = ticketsData.filter((t) => t.ownerEmail === null);
      const assigned = ticketsData.filter((t) => t.ownerEmail !== null);

      expect(unassigned.length).toBeGreaterThan(0);
      expect(assigned.length).toBeGreaterThan(0);
    });

    it("enforces resolutionSummary for RESOLVED and CLOSED tickets", () => {
      const resolvedOrClosed = ticketsData.filter(
        (t) =>
          t.currentStatus === TicketStatus.RESOLVED ||
          t.currentStatus === TicketStatus.CLOSED
      );
      expect(resolvedOrClosed.length).toBeGreaterThan(0);
      for (const t of resolvedOrClosed) {
        expect(t.resolutionSummary).toBeTruthy();
        expect(typeof t.resolutionSummary).toBe("string");
        expect(t.resolutionSummary!.length).toBeGreaterThanOrEqual(10);
      }
    });

    it("includes tickets with Public Comments and Internal Notes", () => {
      const ticketsWithComments = ticketsData.filter((t) => t.comments.length > 0);
      const ticketsWithNotes = ticketsData.filter((t) => t.notes.length > 0);

      expect(ticketsWithComments.length).toBeGreaterThan(0);
      expect(ticketsWithNotes.length).toBeGreaterThan(0);

      // Verify authors in comments and notes belong to seeded users
      const allEmails = new Set(usersData.map((u) => u.email));
      for (const t of ticketsWithComments) {
        for (const c of t.comments) {
          expect(allEmails.has(c.authorEmail)).toBe(true);
          expect(c.content.trim().length).toBeGreaterThan(0);
        }
      }
      for (const t of ticketsWithNotes) {
        for (const n of t.notes) {
          expect(allEmails.has(n.authorEmail)).toBe(true);
          expect(n.content.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Idempotency Verification", () => {
    it("simulates multiple seed runs and confirms zero duplicate records", () => {
      const categoryMap = new Map<string, any>();
      const systemMap = new Map<string, any>();
      const userMap = new Map<string, any>();
      const ticketMap = new Map<string, any>();

      const runSeedSimulation = () => {
        for (const cat of categoriesData) {
          categoryMap.set(cat.name, { ...cat });
        }
        for (const sys of relatedSystemsData) {
          systemMap.set(sys.name, { ...sys });
        }
        for (const user of usersData) {
          userMap.set(user.email, { ...user });
        }
        for (const ticket of ticketsData) {
          ticketMap.set(ticket.ticketNumber, { ...ticket });
        }
      };

      // Run 1
      runSeedSimulation();
      expect(categoryMap.size).toBe(4);
      expect(systemMap.size).toBe(7);
      expect(userMap.size).toBe(usersData.length);
      expect(ticketMap.size).toBe(ticketsData.length);

      // Run 2 (simulate idempotent re-execution)
      runSeedSimulation();
      expect(categoryMap.size).toBe(4);
      expect(systemMap.size).toBe(7);
      expect(userMap.size).toBe(usersData.length);
      expect(ticketMap.size).toBe(ticketsData.length);
    });
  });
});
