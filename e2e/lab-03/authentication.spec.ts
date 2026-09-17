import { expect, test } from "@playwright/test";

test.describe("E2E-AUTH: Authentication & Password Lifecycle Flow", () => {
  const normalUser = {
    id: 1,
    name: "Suda Sukjai",
    email: "suda.admin@toktickit.com",
    role: "ADMINISTRATOR",
    isActive: true,
    mustChangePassword: false,
  };

  const firstLoginUser = {
    id: 2,
    name: "New Staff",
    email: "new.staff@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: true,
  };

  test("E2E-AUTH-01: valid login, mustChangePassword redirect, password complexity checklist, and successful entry", async ({ page }) => {
    let currentUser = { ...firstLoginUser };

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.email === "wrong@toktickit.com") {
          return json({ error: "Invalid email or password" }, 401);
        }
        if (body.email === firstLoginUser.email) {
          return json({ token: "fake-jwt-token-1", user: currentUser });
        }
        return json({ token: "fake-jwt-token-admin", user: normalUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(currentUser);
      }

      if (url.pathname === "/api/auth/change-password" && req.method() === "POST") {
        currentUser = { ...currentUser, mustChangePassword: false };
        return json({ message: "Password changed successfully", user: currentUser });
      }

      if (url.pathname === "/api/auth/logout") {
        return json({ message: "Logged out" });
      }

      if (url.pathname === "/api/categories") {
        return json([]);
      }

      if (url.pathname === "/api/staff/tickets") {
        return json({ tickets: [], pagination: { total: 0, totalPages: 1, page: 1, limit: 10 } });
      }

      return json({ error: "Not found" }, 404);
    });

    // 1. Visit Login screen
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "TokTickIT" })).toBeVisible();
    await expect(page.getByText("Sign in to your account")).toBeVisible();

    // 2. Test invalid credentials
    await page.getByLabel(/Email Address/i).fill("wrong@toktickit.com");
    await page.locator("#login-password").fill("WrongPassword123!");
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();

    // 3. Test login with user requiring password change
    await page.getByLabel(/Email Address/i).fill(firstLoginUser.email);
    await page.locator("#login-password").fill("OldInitialPass123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 4. Verify redirection to Change Password view
    await expect(page.getByRole("heading", { name: "Password Change Required" })).toBeVisible();
    await expect(page.getByText(/Because you signed in with an initial temporary password/i)).toBeVisible();

    // 5. Verify real-time password complexity checklist
    const currentPwd = page.getByLabel(/Current \(Temporary\) Password/i);
    const newPwd = page.getByLabel(/^New Password/i);
    const confirmPwd = page.getByLabel(/Confirm New Password/i);
    const submitBtn = page.getByRole("button", { name: /Save New Password & Continue/i });

    await currentPwd.fill("OldInitialPass123!");
    expect(await submitBtn.isDisabled()).toBe(true);

    // Type short password
    await newPwd.fill("Short1");
    expect(await submitBtn.isDisabled()).toBe(true);

    // Type valid complex password
    await newPwd.fill("SecurePassword123!");
    await confirmPwd.fill("SecurePassword123!");
    expect(await submitBtn.isDisabled()).toBe(false);

    // Submit password change
    await submitBtn.click();

    // 6. Enters application and displays IT Staff view
    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();
    await expect(page.getByText("New Staff")).toBeVisible();

    // 7. Test Logout action
    await page.getByRole("button", { name: /Sign Out/i }).click();
    await expect(page.getByRole("heading", { name: "TokTickIT" })).toBeVisible();
    await expect(page.getByText("Sign in to your account")).toBeVisible();
  });
});
