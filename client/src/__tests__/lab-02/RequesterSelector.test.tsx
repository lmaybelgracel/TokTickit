import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import { RequesterSelector } from "../../components/RequesterSelector";
import * as api from "../../api";

vi.mock("../../api", () => ({
  fetchRequesters: vi.fn(),
}));

describe("RequesterSelector Component Tests (Issue 9)", () => {
  const mockRequesters = [
    {
      id: 1,
      name: "Pae Karn",
      email: "pae.karn@example.com",
      department: "Engineering",
      isActive: true,
    },
    {
      id: 2,
      name: "Miki Chan",
      email: "miki.chan@example.com",
      department: "Information Technology",
      isActive: true,
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render loading state initially", () => {
    (api.fetchRequesters as any).mockReturnValue(new Promise(() => {}));

    render(<RequesterSelector onSelectRequester={vi.fn()} />);

    expect(screen.getByTestId("loading-state")).toBeDefined();
  });

  it("should render dropdown with active requesters and notice banner after loading", async () => {
    (api.fetchRequesters as any).mockResolvedValue(mockRequesters);

    render(<RequesterSelector onSelectRequester={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Select Development Requester")).toBeDefined();
      expect(screen.getByText("Pae Karn (pae.karn@example.com) — Engineering")).toBeDefined();
    });
  });

  it("should trigger onSelectRequester when Continue button is clicked", async () => {
    (api.fetchRequesters as any).mockResolvedValue(mockRequesters);
    const onSelectMock = vi.fn();

    render(<RequesterSelector onSelectRequester={onSelectMock} />);

    await waitFor(() => {
      expect(screen.getByText("Continue to Application")).toBeDefined();
    });

    const submitBtn = screen.getByText("Continue to Application");
    fireEvent.click(submitBtn);

    expect(onSelectMock).toHaveBeenCalledWith(mockRequesters[0]);
  });

  it("should render safe error state if API fails", async () => {
    (api.fetchRequesters as any).mockRejectedValue(new Error("Unable to connect to API"));

    render(<RequesterSelector onSelectRequester={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId("error-state")).toBeDefined();
      expect(screen.getByText("Unable to connect to API")).toBeDefined();
    });
  });
});
