import { expect, test } from "@playwright/test";

test("captures Zen Green responsive evidence without horizontal overflow", async ({ page }) => {
  const requester = { id: 1, name: "Pae Karn", email: "pae.karn@example.com", department: "Engineering", isActive: true };
  const category = { id: 1, name: "Hardware", description: "Devices" };
  const system = { id: 1, name: "Corporate Laptop", category: "Hardware" };
  const attachment = { id: 501, ticketId: 101, filename: "diagnostic-report-with-a-long-readable-filename.png", fileSize: 2048, mimeType: "image/png", isRemoved: false, uploadedAt: "2026-09-03T10:00:00Z" };
  const ticket = { id: 101, ticketNumber: "TKT-2026-000101", summary: "Laptop battery drains quickly", description: "Battery drains within one hour during normal use.", requestedPriority: "HIGH", currentStatus: "NEW", requesterId: 1, categoryId: 1, relatedSystemId: 1, createdAt: "2026-09-03T10:00:00Z", updatedAt: "2026-09-03T10:00:00Z", requester, category, relatedSystem: system, attachments: [attachment] };
  let removedAttachment = false;

  await page.route("**/api/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname === "/api/requesters") return json([requester]);
    if (pathname === "/api/categories") return json([category]);
    if (pathname === "/api/related-systems") return json([system]);
    if (pathname === "/api/tickets") return json({ data: [ticket], pagination: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 10 } });
    if (pathname === "/api/tickets/101") return json({ ...ticket, attachments: [{ ...attachment, isRemoved: removedAttachment, removedAt: removedAttachment ? "2026-09-03T11:00:00Z" : null, removalReason: removedAttachment ? "Outdated visual evidence" : null }] });
    if (pathname === "/api/attachments/501" && route.request().method() === "DELETE") {
      removedAttachment = true;
      return json({ ...attachment, isRemoved: true, removedAt: "2026-09-03T11:00:00Z", removalReason: "Outdated visual evidence" });
    }
    return json({ error: { code: "NOT_FOUND" } }, 404);
  });

  const assertNoHorizontalOverflow = async () => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Select Development Requester" })).toBeVisible();
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/requester-selection-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Continue to Application" }).click();

  await expect(page.getByRole("heading", { name: "My Tickets" })).toBeVisible();
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/desktop-table.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/mobile-card.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 568 });
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/small-mobile-card.png", fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("navigation").getByRole("button", { name: "+ Create Ticket" }).click();
  await expect(page.getByRole("heading", { name: "Create Support Ticket" })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 820, height: 1180 });
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/tablet.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Submit Ticket" }).click();
  await expect(page.getByText("Summary must be between 5 and 150 characters.")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/validation-mobile.png", fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("navigation").getByRole("button", { name: "My Tickets" }).click();
  await page.getByRole("row").filter({ hasText: ticket.ticketNumber }).getByRole("button", { name: "View detail" }).click();
  await expect(page.getByRole("heading", { name: ticket.ticketNumber })).toBeVisible();
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/desktop-active-attachment.png", fullPage: true });
  await page.getByRole("button", { name: "Soft Remove" }).click();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/removal-modal.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(page.getByRole("dialog")).toBeVisible();
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/small-mobile-removal-modal.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("textbox").fill("Outdated visual evidence");
  await page.getByRole("button", { name: "Confirm removal" }).click();
  await expect(page.getByText("Removed", { exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/desktop-removed-attachment.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/mobile-removed-attachment.png", fullPage: true });
});
