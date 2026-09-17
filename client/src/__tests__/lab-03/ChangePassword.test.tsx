import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ChangePassword } from "../../components/ChangePassword";
import { AuthProvider } from "../../context/AuthContext";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    changePassword: vi.fn(),
    fetchCurrentUser: vi.fn(),
    logoutUser: vi.fn(),
  };
});

describe("ChangePassword Component Tests (Sprint 3 - Issue 19)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("toktickit_auth_token", "fake-initial-token");
    (api.fetchCurrentUser as any).mockResolvedValue({
      id: 3,
      name: "Miki Chan",
      email: "miki.chan@example.com",
      role: "REQUESTER",
      mustChangePassword: true,
    });
  });

  it("renders amber security notice and password complexity checklist", async () => {
    render(
      <AuthProvider>
        <ChangePassword />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Password Change Required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/For security reasons, access to ticket queues and management screens is locked/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/At least one uppercase letter \(A-Z\)/i)).toBeInTheDocument();
      expect(screen.getByText(/At least one lowercase letter \(a-z\)/i)).toBeInTheDocument();
      expect(screen.getByText(/At least one numeric digit \(0-9\)/i)).toBeInTheDocument();
    });
  });

  it("disables submit button until password meets all complexity rules and matches confirmation", async () => {
    render(
      <AuthProvider>
        <ChangePassword />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Save New Password & Continue/i })).toBeDisabled();
    });

    const currentInput = screen.getByPlaceholderText(/Enter current password/i);
    const newInput = screen.getByPlaceholderText(/Create a new secure password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm new password/i);

    fireEvent.change(currentInput, { target: { value: "Pass1234!" } });
    fireEvent.change(newInput, { target: { value: "short" } });
    fireEvent.change(confirmInput, { target: { value: "short" } });

    // Still disabled due to length < 8 and missing uppercase/number
    expect(screen.getByRole("button", { name: /Save New Password & Continue/i })).toBeDisabled();

    // Now satisfy all rules: min 8, uppercase, lowercase, number, matching
    fireEvent.change(newInput, { target: { value: "SecurePassword123!" } });
    fireEvent.change(confirmInput, { target: { value: "SecurePassword123!" } });

    expect(screen.getByRole("button", { name: /Save New Password & Continue/i })).not.toBeDisabled();

    // If new password is identical to current password, it must disable button and show warning
    fireEvent.change(newInput, { target: { value: "Pass1234!" } });
    fireEvent.change(confirmInput, { target: { value: "Pass1234!" } });
    expect(screen.getByRole("button", { name: /Save New Password & Continue/i })).toBeDisabled();
    expect(screen.getByText(/New password must be different from current password/i)).toBeInTheDocument();
  });

  it("submits password change and calls changePassword API with current and new password", async () => {
    (api.changePassword as any).mockResolvedValueOnce({
      message: "Password changed successfully",
      mustChangePassword: false,
    });

    render(
      <AuthProvider>
        <ChangePassword />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter current password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter current password/i), {
      target: { value: "Pass1234!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Create a new secure password/i), {
      target: { value: "NewSecurePass123!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm new password/i), {
      target: { value: "NewSecurePass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save New Password & Continue/i }));

    await waitFor(() => {
      expect(api.changePassword).toHaveBeenCalledWith(
        {
          currentPassword: "Pass1234!",
          newPassword: "NewSecurePass123!",
        },
        "fake-initial-token"
      );
    });
  });

  it("displays error alert when current password is wrong or API fails", async () => {
    (api.changePassword as any).mockRejectedValueOnce(
      new Error("Current password does not match")
    );

    render(
      <AuthProvider>
        <ChangePassword />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter current password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter current password/i), {
      target: { value: "WrongCurrentPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Create a new secure password/i), {
      target: { value: "NewSecurePass123!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm new password/i), {
      target: { value: "NewSecurePass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save New Password & Continue/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/Current password does not match/i)).toBeInTheDocument();
    });
  });
});
