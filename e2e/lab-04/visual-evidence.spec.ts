import { expect, Page, test } from "@playwright/test";

test.describe("Sprint 4 Visual Evidence, Responsive Layout & Accessibility Audit (Issue 35)", () => {
  const assertNoHorizontalOverflow = async (page: Page) => {
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(isOverflowing).toBe(false);
  };

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
  const system = { id: 1, name: "Laser Printer", category: "Hardware" };

  const sampleTicket = {
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
    requesterResolvedIndication: true,
    resolutionSummary: null,
    resolvedAt: null,
  };

  const sampleActions = [
    {
      id: 1,
      ticketId: 202,
      actionDateTime: "2026-10-16T10:30:00Z",
      description: "Inspected pickup roller assembly for rubber glazing.",
      result: "PARTIALLY_RESOLVED",
      followUpRequired: true,
      followUpNote: "Order replacement roller kit if cleaning fails.",
      performedById: 20,
      createdAt: "2026-10-16T10:30:00Z",
      updatedAt: "2026-10-16T10:30:00Z",
      performedBy: staffUser,
    },
    {
      id: 2,
      ticketId: 202,
      actionDateTime: "2026-10-16T11:00:00Z",
      description: "Cleaned optical sensor emitter and receiver lenses with isopropyl alcohol.",
      result: "RESOLVED",
      followUpRequired: false,
      followUpNote: null,
      performedById: 20,
      createdAt: "2026-10-16T11:00:00Z",
      updatedAt: "2026-10-16T11:00:00Z",
      performedBy: staffUser,
    },
  ];

  test("1. Captures responsive evidence for Requester Dashboard (Desktop 1280, Tablet 768, Mobile 375, Small Mobile 320)", async ({ page }) => {
    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-requester", user: requesterUser });
      }
      if (url.pathname === "/api/auth/me") {
        return json(requesterUser);
      }
      if (url.pathname === "/api/dashboard/requester") {
        return json({
          metrics: {
            totalOpenTickets: 3,
            waitingForRequester: 1,
            resolvedOrClosed: 4,
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
              summary: "HDMI display connection restored in Meeting Room 3",
              currentStatus: "RESOLVED",
              resolutionSummary: "Installed shielded 4K HDMI cable.",
              resolvedAt: "2026-10-15T15:00:00Z",
              updatedAt: "2026-10-15T15:00:00Z",
            },
          ],
        });
      }
      return json({}, 200);
    });

    // 1.1 Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(requesterUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("heading", { name: /Welcome, Alice Requester!/i })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/requester-dashboard/requester-dashboard-desktop-1280.png",
      fullPage: true,
    });

    // 1.2 Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/requester-dashboard/requester-dashboard-tablet-768.png",
      fullPage: true,
    });

    // 1.3 Mobile 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/requester-dashboard/requester-dashboard-mobile-375.png",
      fullPage: true,
    });

    // 1.4 Small Mobile 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/requester-dashboard/requester-dashboard-mobile-320.png",
      fullPage: true,
    });
  });

  test("2. Captures responsive evidence for IT Staff Operations Dashboard (Desktop 1280, Tablet 768, Mobile 375, Small Mobile 320)", async ({ page }) => {
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
          metrics: {
            unassignedTickets: 3,
            myAssignedTickets: 4,
            myActionsTakenCount: 6,
            urgentTickets: 2,
            waitingForRequester: 1,
            totalActiveTickets: 8,
          },
          statusDistribution: {
            NEW: 1,
            OPEN: 2,
            IN_PROGRESS: 4,
            WAITING_FOR_REQUESTER: 1,
            RESOLVED: 5,
            CLOSED: 3,
            REOPENED: 0,
            CANCELLED: 0,
          },
          priorityDistribution: {
            LOW: 1,
            MEDIUM: 3,
            HIGH: 2,
            URGENT: 2,
          },
          recentQueueActivity: [
            {
              id: 202,
              ticketNumber: "TKT-2026-000202",
              summary: "Laser printer repeatedly jams on tray 2 pickup",
              currentStatus: "IN_PROGRESS",
              itPriority: "HIGH",
              owner: staffUser,
              updatedAt: "2026-10-16T11:00:00Z",
            },
          ],
        });
      }
      return json({}, 200);
    });

    // 2.1 Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("heading", { name: /Welcome back, Somchai Staff/i })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/staff-dashboard/staff-dashboard-desktop-1280.png",
      fullPage: true,
    });

    // 2.2 Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/staff-dashboard/staff-dashboard-tablet-768.png",
      fullPage: true,
    });

    // 2.3 Mobile 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/staff-dashboard/staff-dashboard-mobile-375.png",
      fullPage: true,
    });

    // 2.4 Small Mobile 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/staff-dashboard/staff-dashboard-mobile-320.png",
      fullPage: true,
    });
  });

  test("3. Captures visual evidence for Actions Taken collaboration section & Resolution Modal with accessibility checks", async ({ page }) => {
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
          metrics: { unassignedTickets: 0, myAssignedTickets: 1, myActionsTakenCount: 2, urgentTickets: 0, waitingForRequester: 0, totalActiveTickets: 1 },
          statusDistribution: { IN_PROGRESS: 1 },
          priorityDistribution: { HIGH: 1 },
          recentQueueActivity: [],
        });
      }
      if (url.pathname === "/api/staff/tickets") {
        return json({
          tickets: [sampleTicket],
          pagination: { total: 1, totalPages: 1, page: 1, limit: 10 },
        });
      }
      if (url.pathname === "/api/tickets/202" || url.pathname === "/api/staff/tickets/202") {
        return json(sampleTicket);
      }
      if (url.pathname === "/api/tickets/202/actions") {
        return json(sampleActions);
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
      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }
      return json({}, 200);
    });

    // 3.1 Login and Navigate to Ticket Detail (Actions Taken Section)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await page.getByRole("button", { name: "Staff Queue" }).click();
    await page.getByRole("button", { name: "TKT-2026-000202" }).click();

    // Verify Actions Taken heading & entries are visible
    await expect(page.getByRole("heading", { name: /Actions Taken/i })).toBeVisible();
    await expect(page.getByText(/Inspected pickup roller assembly/i)).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/actions-taken/actions-taken-desktop-1280.png",
      fullPage: true,
    });

    // Mobile Actions Taken view
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/actions-taken/actions-taken-mobile-375.png",
      fullPage: true,
    });

    // 3.2 Formal Resolution Modal Visual & Accessibility Audit
    await page.setViewportSize({ width: 1280, height: 800 });
    const resolveBtn = page.getByRole("button", { name: "Resolve Ticket" });
    await expect(resolveBtn).toBeVisible();
    await resolveBtn.click();

    // Verify Modal Dialog accessibility semantics (role="dialog", visible)
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: /Resolve Ticket/i })).toBeVisible();

    // Capture desktop resolution modal screenshot
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/resolution/resolution-modal-desktop-1280.png",
    });

    // Mobile resolution modal screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: "artifacts/lab-04/screenshots/resolution/resolution-modal-mobile-375.png",
    });

    // Test WCAG 2.1 AA Keyboard Accessibility: ESC key dismisses modal
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
