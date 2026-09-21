import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { Login } from "../../components/Login";
import { AuthProvider } from "../../context/AuthContext";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    loginUser: vi.fn(),
    fetchCurrentUser: vi.fn(),
    logoutUser: vi.fn(),
  };
});

describe("Login Component Tests (Sprint 3 - Issue 19)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders email, password inputs, toggle visibility, and Sign In button", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Show password/i })).toBeInTheDocument();
  });

  it("toggles password visibility between password and text type", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /Show password/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Hide password/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits valid credentials and calls loginUser API", async () => {
    (api.loginUser as any).mockResolvedValueOnce({
      token: "mock-jwt-token",
      user: {
        id: 1,
        email: "pae.karn@example.com",
        name: "Pae Karn",
        role: "REQUESTER",
        mustChangePassword: false,
      },
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "pae.karn@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith({
        email: "pae.karn@example.com",
        password: "Password123!",
      });
      expect(localStorage.getItem("toktickit_auth_token")).toBe("mock-jwt-token");
    });
  });

  it("displays error alert when login fails", async () => {
    (api.loginUser as any).mockRejectedValueOnce(new Error("Invalid email or password"));

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "WrongPass1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
});
