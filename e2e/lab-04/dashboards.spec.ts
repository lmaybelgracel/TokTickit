import { expect, test } from "@playwright/test";

test.describe("E2E-DASH: Operational & Requester Dashboards Drill-down & Responsive Audits (Sprint 4 - Issue 35)", () => {
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

  const sampleTicket = {
    id: 202,
    ticketNumber: "TKT-2026-000202",
    summary: "Laser printer repeatedly jams on tray 2 pickup",
    description: "Roller slips during paper feed cycle.",
    requestedPriority: "MEDIUM",
    itPriority: "URGENT",
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

  test("E2E-DASH-01 (AC-11): IT Staff operational dashboard displays metrics and supports drill-down into filtered queue", async ({ page }) => {
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
          metrics: {
            unassignedTickets: 2,
            myAssignedTickets: 3,
            myActionsTakenCount: 5,
            urgentTickets: 1,
            waitingForRequester: 1,
            totalActiveTickets: 6,
          },
          statusDistribution: {
            NEW: 1,
            OPEN: 1,
            IN_PROGRESS: 2,
            WAITING_FOR_REQUESTER: 1,
            RESOLVED: 4,
            CLOSED: 2,
            REOPENED: 0,
            CANCELLED: 0,
          },
          priorityDistribution: {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 2,
            URGENT: 1,
          },
          recentQueueActivity: [
            {
              id: 202,
              ticketNumber: "TKT-2026-000202",
              summary: "Laser printer repeatedly jams on tray 2 pickup",
              currentStatus: "IN_PROGRESS",
              itPriority: "URGENT",
              owner: staffUser,
              updatedAt: "2026-10-16T11:00:00Z",
            },
          ],
        });
      }

      if (url.pathname === "/api/staff/tickets") {
        const ownerParam = url.searchParams.get("ownerId") || url.searchParams.get("owner");
        const tickets =
          ownerParam === "unassigned"
            ? [
                { ...sampleTicket, id: 201, ticketNumber: "TKT-2026-000201", ownerId: null, owner: null },
                { ...sampleTicket, id: 202, ticketNumber: "TKT-2026-000202", ownerId: null, owner: null },
              ]
            : [sampleTicket];

        return json({
          tickets,
          pagination: { total: tickets.length, totalPages: 1, page: 1, limit: 10 },
        });
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
      }

      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }

      return json({ error: "Not found" }, 404);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 1. Verify Staff Operations Dashboard is rendered
    await expect(page.getByRole("heading", { name: /Welcome back, Somchai Staff/i })).toBeVisible();

    // 2. Verify Metric Cards
    const unassignedCard = page.getByTestId("metric-unassigned");
    await expect(unassignedCard).toBeVisible();
    await expect(unassignedCard.locator(".metric-card-value")).toHaveText("2");

    const myActiveCard = page.getByTestId("metric-my-active");
    await expect(myActiveCard).toBeVisible();
    await expect(myActiveCard.locator(".metric-card-value")).toHaveText("3");

    const myActionsCard = page.getByTestId("metric-my-actions");
    await expect(myActionsCard).toBeVisible();
    await expect(myActionsCard.locator(".metric-card-value")).toHaveText("5");

    const urgentCard = page.getByTestId("metric-urgent");
    await expect(urgentCard).toBeVisible();
    await expect(urgentCard.locator(".metric-card-value")).toHaveText("1");

    // 3. Drill-down: Click Unassigned metric card -> navigates to Staff Queue matching count (AC-11, E2E-DASH-01)
    await unassignedCard.click();
    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();

    // Verify queue filter indicates unassigned via active toggle button
    const unassignedBtn = page.getByRole("button", { name: "Unassigned" });
    await expect(unassignedBtn).toBeVisible();
    await expect(unassignedBtn).toHaveClass(/staff-queue__toggle-btn--active/);

    // Verify filtered queue table contains exactly 2 matching rows (matching count parity per AC-11)
    const ticketRows = page.locator(".staff-queue__table tbody tr");
    await expect(ticketRows).toHaveCount(2);

    // 4. Return to Staff Dashboard via Navigation Bar
    const staffDashNav = page.getByRole("button", { name: /^Dashboard$/i });
    await expect(staffDashNav).toBeVisible();
    await staffDashNav.click();
    await expect(page.getByRole("heading", { name: /Welcome back, Somchai Staff/i })).toBeVisible();

    // 5. Drill-down: Click Urgent metric card
    await page.getByTestId("metric-urgent").click();
    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();
  });

  test("E2E-DASH-02 (AC-04): Requester dashboard displays personal summary metrics and supports drill-down navigation", async ({ page }) => {
    let activeApiUser = requesterUser;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        activeApiUser = requesterUser;
        return json({ token: "token-requester", user: requesterUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(activeApiUser);
      }

      if (url.pathname === "/api/dashboard/requester") {
        return json({
          metrics: {
            totalOpenTickets: 2,
            waitingForRequester: 1,
            resolvedOrClosed: 3,
          },
          recentTickets: [
            {
              id: 202,
              ticketNumber: "TKT-2026-000202",
              summary: "Laser printer repeatedly jams on tray 2 pickup",
              currentStatus: "IN_PROGRESS",
              requestedPriority: "MEDIUM",
              updatedAt: "2026-10-16T11:00:00Z",
            },
          ],
          recentlyResolved: [
            {
              id: 201,
              ticketNumber: "TKT-2026-000201",
              summary: "Replaced HDMI cable for conference room display",
              currentStatus: "RESOLVED",
              resolutionSummary: "New HDMI 2.1 cable connected and tested with 4K output.",
              resolvedAt: "2026-10-15T15:00:00Z",
              updatedAt: "2026-10-15T15:00:00Z",
            },
          ],
        });
      }

      if (url.pathname === "/api/tickets") {
        return json({
          data: [sampleTicket],
          pagination: {
            totalItems: 1,
            totalPages: 1,
            currentPage: 1,
            pageSize: 10,
          },
        });
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
      }

      return json({ error: "Not found" }, 404);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(requesterUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 1. Verify Requester Dashboard is rendered
    await expect(page.getByRole("heading", { name: /Welcome, Alice Requester!/i })).toBeVisible();

    // 2. Verify Personal Metric Summary Cards
    const openCard = page.getByTestId("metric-open-tickets");
    await expect(openCard).toBeVisible();
    await expect(openCard.locator(".requester-metric-card__value")).toHaveText("2");

    const actionReqCard = page.getByTestId("metric-action-required");
    await expect(actionReqCard).toBeVisible();
    await expect(actionReqCard.locator(".requester-metric-card__value")).toHaveText("1");

    const resolvedCard = page.getByTestId("metric-resolved-tickets");
    await expect(resolvedCard).toBeVisible();
    await expect(resolvedCard.locator(".requester-metric-card__value")).toHaveText("3");

    // 3. Drill-down: Click Total Open Tickets card -> navigates to My Tickets
    await openCard.click();
    await expect(page.getByRole("heading", { name: /My Tickets/i })).toBeVisible();

    // 4. Return to Requester Dashboard
    const reqDashNav = page.getByRole("button", { name: /^Dashboard$/i });
    if (await reqDashNav.isVisible()) {
      await reqDashNav.click();
      await expect(page.getByRole("heading", { name: /Welcome, Alice Requester!/i })).toBeVisible();
    }

    // 5. Quick Action: Create New Ticket button navigates to Create Ticket form
    const createBtn = page.getByTestId("btn-create-ticket");
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    await expect(page.getByRole("heading", { name: /Create Support Ticket/i })).toBeVisible();
  });

  test("E2E-RESP-01 (AC-13): Responsive zero horizontal scrollbar audit at mobile (375px) and tablet (768px)", async ({ page }) => {
    let activeApiUser = requesterUser;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-auth", user: activeApiUser });
      }
      if (url.pathname === "/api/auth/me") {
        return json(activeApiUser);
      }
      if (url.pathname === "/api/dashboard/requester") {
        return json({
          metrics: { totalOpenTickets: 2, waitingForRequester: 1, resolvedOrClosed: 3 },
          recentTickets: [],
          recentlyResolved: [],
        });
      }
      if (url.pathname === "/api/dashboard/staff") {
        return json({
          metrics: {
            unassignedTickets: 2,
            myAssignedTickets: 3,
            myActionsTakenCount: 5,
            urgentTickets: 1,
            waitingForRequester: 1,
            totalActiveTickets: 6,
          },
          statusDistribution: {},
          priorityDistribution: {},
          recentQueueActivity: [],
        });
      }
      return json({ error: "Not found" }, 404);
    });

    const assertNoHorizontalOverflow = async () => {
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(isOverflowing).toBe(false);
    };

    // Test Requester Dashboard at mobile 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(requesterUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("heading", { name: /Welcome, Alice Requester!/i })).toBeVisible();
    await assertNoHorizontalOverflow();

    // Test Requester Dashboard at tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow();

    // Switch to Staff user for Staff Dashboard responsive check
    activeApiUser = staffUser;
    await page.evaluate(() => localStorage.clear());
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("heading", { name: /Welcome back, Somchai Staff/i })).toBeVisible();
    await assertNoHorizontalOverflow();

    // Test Staff Dashboard at tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow();
  });
});
