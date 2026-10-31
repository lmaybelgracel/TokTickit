import { expect, test } from "@playwright/test";

test.describe("E2E-ACT: Actions Taken End-to-End Collaboration & Authorization Flow (Sprint 4 - Issue 35)", () => {
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
  const system = { id: 1, name: "Corporate Laptop", category: "Hardware" };

  test("E2E-ACT-01 & AC-01, AC-02, AC-03, AC-12: IT Staff records Action Taken with validation, verified on detail, Requester view enforces read-only", async ({ page }) => {
    let currentTicket: any = {
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Intermittent display blackout on external monitor",
      description: "Display loses sync every 20 minutes under load.",
      requestedPriority: "HIGH",
      itPriority: "HIGH",
      currentStatus: "IN_PROGRESS",
      requesterId: 10,
      ownerId: 20,
      createdAt: "2026-10-15T08:00:00Z",
      updatedAt: "2026-10-15T09:00:00Z",
      category,
      relatedSystem: system,
      requester: requesterUser,
      owner: staffUser,
      attachments: [],
      requesterResolvedIndication: false,
      resolutionSummary: null,
      resolvedAt: null,
    };

    let actionsTakenList: any[] = [
      {
        id: 1,
        ticketId: 101,
        actionType: "DIAGNOSTIC",
        actionDateTime: "2026-10-15T08:30:00Z",
        description: "Ran GPU diagnostic and confirmed memory clock fluctuation.",
        result: "PARTIALLY_RESOLVED",
        followUpRequired: false,
        followUpNote: null,
        performedById: 20,
        createdAt: "2026-10-15T08:35:00Z",
        updatedAt: "2026-10-15T08:35:00Z",
        performedBy: staffUser,
      },
    ];

    let activeApiUser = staffUser;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.email === requesterUser.email) {
          activeApiUser = requesterUser;
          return json({ token: "token-requester", user: requesterUser });
        }
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
          myActionsTakenCount: actionsTakenList.length,
          statusDistribution: { NEW: 0, OPEN: 0, IN_PROGRESS: 1, WAITING_FOR_REQUESTER: 0, RESOLVED: 0, CLOSED: 0, REOPENED: 0 },
          priorityDistribution: { URGENT: 1, HIGH: 0, MEDIUM: 0, LOW: 0 },
          queueSummary: { totalCount: 1, urgentOpenCount: 1, waitingRequesterCount: 0, resolvedTodayCount: 0 },
          recentQueueActivity: [],
        });
      }

      if (url.pathname === "/api/dashboard/requester") {
        return json({
          metrics: {
            totalOpenTickets: 1,
            waitingForRequester: 0,
            resolvedOrClosed: 0,
          },
          recentTickets: [currentTicket],
          recentlyResolved: [],
        });
      }

      if (url.pathname === "/api/staff/tickets") {
        return json({
          tickets: [currentTicket],
          pagination: { total: 1, totalPages: 1, page: 1, limit: 10 },
        });
      }

      if (url.pathname === "/api/tickets" && req.method() === "GET") {
        return json({
          data: [currentTicket],
          pagination: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        });
      }

      if (url.pathname === "/api/tickets/101" || url.pathname === "/api/staff/tickets/101") {
        return json(currentTicket);
      }

      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }

      if (url.pathname === "/api/tickets/101/actions" && req.method() === "GET") {
        return json(actionsTakenList);
      }

      if (url.pathname === "/api/tickets/101/actions" && req.method() === "POST") {
        if (activeApiUser.role === "REQUESTER") {
          return json({ error: "Only IT Staff may record actions" }, 403);
        }
        const body = JSON.parse(req.postData() || "{}");
        if (body.followUpRequired && (!body.followUpNote || !body.followUpNote.trim())) {
          return json({ error: "Follow-up note is required when follow-up is requested" }, 422);
        }
        const newAction = {
          id: actionsTakenList.length + 1,
          ticketId: 101,
          actionType: body.actionType || "MAINTENANCE",
          actionDateTime: body.actionDateTime || new Date().toISOString(),
          description: body.description,
          result: body.result || "RESOLVED",
          followUpRequired: Boolean(body.followUpRequired),
          followUpNote: body.followUpNote || null,
          attachmentNotes: body.attachmentNotes || null,
          performedById: activeApiUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          performedBy: activeApiUser,
        };
        actionsTakenList.unshift(newAction);
        currentTicket.updatedAt = new Date().toISOString();
        return json(newAction, 201);
      }

      if (url.pathname === "/api/tickets/101/comments") {
        return json([]);
      }

      if (url.pathname === "/api/staff/tickets/101/notes") {
        return json([]);
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
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

    await page.getByRole("button", { name: "TKT-2026-000101" }).click();
    await expect(page.getByRole("heading", { name: "TKT-2026-000101" })).toBeVisible();

    // 3. Verify Actions Taken section renders existing record (AC-12)
    const actionsSection = page.getByTestId("actions-taken-section");
    await expect(actionsSection).toBeVisible();
    await expect(actionsSection.getByText("Ran GPU diagnostic and confirmed memory clock fluctuation.")).toBeVisible();
    await expect(actionsSection.getByText("Somchai Staff")).toBeVisible();

    // 4. Click "+ Record Action Taken" to open modal (AC-01)
    const recordBtn = page.getByTestId("btn-record-action");
    await expect(recordBtn).toBeVisible();
    await recordBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Record Action Taken" })).toBeVisible();

    // 5. Fill valid description and result
    const descInput = page.locator("#action-description");
    await descInput.fill("Replaced faulty GPU riser cable and tightened connector screws.");

    const resultInput = page.locator("#action-result");
    await resultInput.fill("Display sync restored and zero frame drop detected.");

    // Toggle follow-up required (AC-03)
    const followUpCheckbox = page.locator("#action-followup-toggle");
    await followUpCheckbox.check();

    // Verify Save Action button is disabled when follow-up note is empty (AC-03 validation)
    const saveBtn = page.getByTestId("btn-save-action");
    await expect(saveBtn).toBeDisabled();

    // Fill follow-up note
    const followUpNoteInput = page.locator("#action-followup-note");
    await followUpNoteInput.fill("Run 24-hour display burn-in test to confirm zero drops.");

    // Save button becomes enabled
    await expect(saveBtn).toBeEnabled();

    // Submit valid Action Taken (AC-01)
    await saveBtn.click();

    // Modal closes
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // 6. Verify newly recorded action appears in list
    await expect(page.getByText("Replaced faulty GPU riser cable and tightened connector screws.")).toBeVisible();
    await expect(page.getByText("Run 24-hour display burn-in test to confirm zero drops.")).toBeVisible();

    // 7. Sign Out IT Staff
    await page.getByRole("button", { name: /Sign Out/i }).click();

    // 8. Login as Requester (AC-02)
    await page.getByLabel(/Email Address/i).fill(requesterUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // Navigate to My Tickets if on Requester Dashboard
    const myTicketsNav = page.getByRole("button", { name: "My Tickets", exact: true });
    if (await myTicketsNav.isVisible()) {
      await myTicketsNav.click();
    }

    // View ticket details
    const reqTicketRow = page.getByRole("row").filter({ hasText: "TKT-2026-000101" });
    await expect(reqTicketRow).toBeVisible();
    await reqTicketRow.getByRole("button", { name: /View detail/i }).click();

    // 9. Requester can view Actions Taken list (AC-12)
    await expect(page.getByText("Replaced faulty GPU riser cable and tightened connector screws.")).toBeVisible();

    // 10. Enforce AC-02: "+ Record Action Taken" button is strictly hidden for Requester
    await expect(page.getByTestId("btn-record-action")).not.toBeVisible();
  });
});
