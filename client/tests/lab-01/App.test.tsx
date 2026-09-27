import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import App from "../../src/App.js";
import * as api from "../../src/api.js";

describe("App UI Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("renders the TokTickIT heading", () => {
    render(<App />);
    expect(screen.getByText(/TokTickIT/i)).toBeInTheDocument();
  });

  it("renders Login screen when no user is authenticated", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });
  });

  it("renders authenticated shell when user is authenticated in localStorage", async () => {
    localStorage.setItem("toktickit_auth_token", "valid-test-token");
    vi.spyOn(api, "fetchCurrentUser").mockResolvedValueOnce({
      id: 1,
      name: "Jennifer Anderson",
      email: "jennifer.a@kmutt.ac.th",
      role: "REQUESTER",
      mustChangePassword: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/Jennifer Anderson/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/My Tickets/i).length).toBeGreaterThan(0);
    });
  });
});
