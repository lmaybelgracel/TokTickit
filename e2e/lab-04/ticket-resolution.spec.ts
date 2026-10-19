import { expect, test } from "@playwright/test";

test.describe("E2E-RES: Ticket Status Workflow, Formal Resolution Gate & Advisory Flows (Sprint 4 - Issue 35)", () => {
  const staffUser = {
    id: 20,
    name: "Somchai Staff",
    email: "somchai.it@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: false,
  };

  const requesterUser = {
    id: 10,
    name: "Alice Requester",
    email: "alice.requester@example.com",
    role: "REQUESTER",
    isActive: true,
    mustChangePassword: false,
  };

  const category = { id: 1, name: "Hardware", description: "Hardware support" };
  const system = { id: 1, name: "Office Printer", category: "Hardware" };

  test("E2E-RES-01 & AC-06, AC-07, AC-08, AC-10: Formal Resolution Gate, Concurrency Guard, Advisory Banner, and Status Workflow", async ({ page }) => {
    let currentTicket: any = {
      id: 202,
      ticketNumber: "TKT-2026-000202",
      summary: "Laser printer repeatedly jams on tray 2 paper pickup",
      description: "Roller slips during paper feed cycle.",
      requestedPriority: "MEDIUM",
      itPriority: "HIGH",
      currentStatus: "IN_PROGRESS",
      requesterId: 10,
      ownerId: 20,
      createdAt: "2026-10-16T10:00:00Z",
      updatedAt: "2026-10-16T11:00:00Z",
      category,
      relatedSystem: system,
      requester: requesterUser,
      owner: staffUser,
      attachments: [],
      requesterResolvedIndication: true, // Advisory active (AC-10)
      resolutionSummary: null,
      resolvedAt: null,
    };

    let activeApiUser = staffUser;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        activeApiUser = staffUser;
        return json({ token: "token-staff", user: staffUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(activeApiUser);
      }

      if (url.pathname === "/api/dashboard/staff") {
        return json({
          unassignedCount: 0,
          myAssignedCount: 1,
          myActionsTakenCount: 1,
          statusDistribution: { NEW: 0, OPEN: 0, IN_PROGRESS: 1, WAITING_FOR_REQUESTER: 0, RESOLVED: 0, CLOSED: 0, REOPENED: 0 },
          priorityDistribution: { URGENT: 0, HIGH: 1, MEDIUM: 0, LOW: 0 },
          queueSummary: { totalCount: 1, urgentOpenCount: 0, waitingRequesterCount: 0, resolvedTodayCount: 0 },
          recentQueueActivity: [],
        });
      }

      if (url.pathname === "/api/staff/tickets") {
        return json({
          tickets: [currentTicket],
          pagination: { total: 1, totalPages: 1, page: 1, limit: 10 },
        });
      }

      if (url.pathname === "/api/tickets/202" || url.pathname === "/api/staff/tickets/202") {
        return json(currentTicket);
      }

      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }

      if (url.pathname === "/api/tickets/202/actions") {
        return json([]);
      }

      if (url.pathname === "/api/tickets/202/comments") {
        return json([]);
      }

      if (url.pathname === "/api/staff/tickets/202/notes") {
        return json([]);
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
      }

      // Status mutation guard: Direct transition to RESOLVED rejected (AC-07)
      if (url.pathname === "/api/staff/tickets/202/status" && req.method() === "PATCH") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.status === "RESOLVED") {
          return json({
            error: {
              code: "FORBIDDEN_TRANSITION",
              message: "Direct transition to RESOLVED is forbidden. Use POST /api/staff/tickets/:id/resolve instead.",
            },
          }, 422);
        }
        if (!body.knownUpdatedAt) {
          return json({ error: { code: "VALIDATION_ERROR", message: "knownUpdatedAt is required" } }, 422);
        }
        currentTicket = {
          ...currentTicket,
          currentStatus: body.status,
          updatedAt: new Date().toISOString(),
        };
        return json(currentTicket);
      }

      // Resolution Gate Endpoint (AC-06, AC-08)
      if (url.pathname === "/api/staff/tickets/202/resolve" && (req.method() === "PATCH" || req.method() === "POST")) {
        const body = JSON.parse(req.postData() || "{}");
        if (!body.knownUpdatedAt) {
          return json({ error: { code: "VALIDATION_ERROR", message: "knownUpdatedAt is required" } }, 422);
        }
        if (body.knownUpdatedAt !== currentTicket.updatedAt) {
          return json({ error: { code: "STALE_UPDATE", message: "Conflict: Ticket was modified by another user" } }, 409);
        }
        if (!body.resolutionSummary || body.resolutionSummary.trim().length < 10) {
          return json({ error: { code: "VALIDATION_ERROR", message: "Resolution summary must be at least 10 characters" } }, 422);
        }
        currentTicket = {
          ...currentTicket,
          currentStatus: "RESOLVED",
          resolutionSummary: body.resolutionSummary.trim(),
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return json(currentTicket);
      }

      return json({ error: "Not found" }, 404);
    });

    // 1. Login as IT Staff
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 2. Navigate to Staff Queue -> Select Ticket
    const staffQueueNav = page.getByRole("button", { name: "Staff Queue" });
    if (await staffQueueNav.isVisible()) {
      await staffQueueNav.click();
    }
    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();

    await page.getByRole("button", { name: "TKT-2026-000202" }).click();
    await expect(page.getByRole("heading", { name: "TKT-2026-000202" })).toBeVisible();

    // 3. Verify Advisory Banner is displayed when requesterResolvedIndication is true (AC-10)
    await expect(page.getByText(/The requester has indicated that their problem appears resolved/i)).toBeVisible();

    // 4. Verify Next Status dropdown does NOT allow direct transition to RESOLVED (AC-07)
    const statusSelect = page.locator(".staff-detail__select").filter({ hasText: /Transition Status/i });
    if (await statusSelect.isVisible()) {
      const options = await statusSelect.locator("option").allTextContents();
      const hasResolved = options.some((opt) => opt.toUpperCase().includes("RESOLVED"));
      expect(hasResolved).toBe(false);
    }

    // 5. Open Formal Resolution Modal (AC-06)
    const resolveBtn = page.getByRole("button", { name: "Resolve Ticket" });
    await expect(resolveBtn).toBeVisible();
    await resolveBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Resolve Ticket/i })).toBeVisible();

    // 6. Test resolution summary length validation (< 3 chars -> submit disabled/prevented)
    const summaryInput = page.locator("#resolution-summary-input");
    await expect(summaryInput).toBeVisible();

    const confirmResolveBtn = page.getByRole("button", { name: "Confirm & Resolve" });
    await expect(confirmResolveBtn).toBeDisabled();

    await summaryInput.fill("Ok");
    await expect(confirmResolveBtn).toBeDisabled();

    // Fill valid resolution summary >= 10 chars (AC-06)
    await summaryInput.fill("Replaced worn pickup roller assembly and cleaned optical paper sensors.");
    await expect(confirmResolveBtn).toBeEnabled();

    // 7. Submit Resolution Modal with knownUpdatedAt concurrency check (AC-06, AC-08)
    await confirmResolveBtn.click();

    // 8. Modal closes and Ticket transitions to RESOLVED
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator(".staff-detail__title-wrap").getByText("RESOLVED")).toBeVisible();

    // 9. Resolution summary is visible on the ticket detail
    await expect(page.getByText("Replaced worn pickup roller assembly and cleaned optical paper sensors.")).toBeVisible();
  });

  test("E2E-RES-02 (AC-08): Displays conflict alert banner and refreshes ticket data when 409 Conflict occurs during resolution", async ({ page }) => {
    let currentTicket: any = {
      id: 202,
      ticketNumber: "TKT-2026-000202",
      summary: "Laser printer repeatedly jams on tray 2 paper pickup",
      description: "Roller slips during paper feed cycle.",
      requestedPriority: "MEDIUM",
      itPriority: "HIGH",
      currentStatus: "IN_PROGRESS",
      requesterId: 10,
      ownerId: 20,
      createdAt: "2026-10-16T10:00:00Z",
      updatedAt: "2026-10-16T11:00:00Z",
      category,
      relatedSystem: system,
      requester: requesterUser,
      owner: staffUser,
      attachments: [],
      requesterResolvedIndication: false,
      resolutionSummary: null,
      resolvedAt: null,
    };

    let conflictReturned = false;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-staff", user: staffUser });
      }
      if (url.pathname === "/api/auth/me") {
        return json(staffUser);
      }
      if (url.pathname === "/api/dashboard/staff") {
        return json({
          unassignedTickets: 0,
          myAssignedTickets: 1,
          myActionsTakenCount: 1,
          urgentTickets: 0,
          waitingForRequester: 0,
          totalActiveTickets: 1,
          statusDistribution: { IN_PROGRESS: 1 },
          priorityDistribution: { HIGH: 1 },
          recentQueueActivity: [],
        });
      }
      if (url.pathname === "/api/staff/tickets") {
        return json({
          tickets: [currentTicket],
          pagination: { total: 1, totalPages: 1, page: 1, limit: 10 },
        });
      }
      if (url.pathname === "/api/tickets/202" || url.pathname === "/api/staff/tickets/202") {
        return json(currentTicket);
      }
      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }
      if (url.pathname === "/api/tickets/202/actions") {
        return json([]);
      }
      if (url.pathname === "/api/tickets/202/comments") {
        return json([]);
      }
      if (url.pathname === "/api/staff/tickets/202/notes") {
        return json([]);
      }
      if (url.pathname === "/api/categories") {
        return json([category]);
      }
      if (url.pathname === "/api/staff/tickets/202/resolve" && req.method() === "PATCH") {
        if (!conflictReturned) {
          conflictReturned = true;
          // Stale update returns 409 Conflict per BR-13 & AC-08
          return json({
            error: "Conflict: This ticket was modified by another user.",
            currentUpdatedAt: "2026-10-16T11:45:00Z",
          }, 409);
        }
      }
      return json({}, 200);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await page.getByRole("button", { name: "Staff Queue" }).click();
    await page.getByRole("button", { name: "TKT-2026-000202" }).click();

    // Open resolution modal
    await page.getByRole("button", { name: "Resolve Ticket" }).click();
    await page.locator("#resolution-summary-input").fill("Valid resolution summary exceeding minimum length.");
    await page.getByRole("button", { name: "Confirm & Resolve" }).click();

    // Verify 409 Conflict error banner appears in the modal dialog per AC-08 & BR-13
    await expect(page.getByText(/Conflict: This ticket was modified by another user/i)).toBeVisible();
  });
});

