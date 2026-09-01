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

  it("renders Development Requester selection when no requester is logged in", async () => {
    vi.spyOn(api, "fetchRequesters").mockResolvedValueOnce([
      {
        id: 1,
        name: "Jennifer Anderson",
        email: "jennifer.a@kmutt.ac.th",
        department: "Faculty of Engineering",
        isActive: true,
      },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Select Development Requester/i)).toBeInTheDocument();
    });
  });

  it("renders active requester interface when requester is selected in localStorage", () => {
    localStorage.setItem(
      "toktickit_dev_requester",
      JSON.stringify({
        id: 1,
        name: "Jennifer Anderson",
        email: "jennifer.a@kmutt.ac.th",
        department: "Faculty of Engineering",
        isActive: true,
      })
    );

    render(<App />);

    expect(screen.getAllByText(/Jennifer Anderson/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/My Tickets/i).length).toBeGreaterThan(0);
  });
});
