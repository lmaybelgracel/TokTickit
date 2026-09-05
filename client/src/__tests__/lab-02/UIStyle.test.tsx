import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequesterSelector } from "../../components/RequesterSelector";
import { CreateTicket } from "../../components/CreateTicket";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual<typeof import("../../api")>("../../api");
  return { ...actual, fetchRequesters: vi.fn(), fetchCategories: vi.fn(), fetchRelatedSystems: vi.fn() };
});

const requester = { id: 1, name: "Pae Karn", email: "pae.karn@example.com", department: "Engineering", isActive: true };

describe("Lab 2 Zen Green UI style contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchRequesters).mockResolvedValue([requester]);
    vi.mocked(api.fetchCategories).mockResolvedValue([{ id: 1, name: "Hardware" }]);
    vi.mocked(api.fetchRelatedSystems).mockResolvedValue([{ id: 1, name: "Corporate Laptop" }]);
  });

  it("renders the requester selector as a centered white surface card", async () => {
    const { container } = render(<RequesterSelector onSelectRequester={vi.fn()} />);
    await screen.findByText("Select Development Requester");
    expect(container.querySelector(".requester-selector")).toBeInTheDocument();
    const card = container.querySelector(".requester-selector__card") as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: "#FFFFFF", borderRadius: "12px" });
  });

  it("uses the specified primary action and accessible required requester field", async () => {
    render(<RequesterSelector onSelectRequester={vi.fn()} />);
    const select = await screen.findByLabelText(/Development Requester/);
    expect(select).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("button", { name: "Continue to Application" })).toHaveStyle({ backgroundColor: "#006B3C", color: "#FFFFFF" });
  });

  it("marks every required Create Ticket field for assistive technology", async () => {
    render(<CreateTicket activeRequester={requester} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    await screen.findByText("Create Support Ticket");
    for (const field of ["Category", "Related System", "Summary", "Description"]) {
      expect(screen.getByLabelText(new RegExp(field, "i"))).toHaveAttribute("aria-required", "true");
    }
  });

  it("keeps system-generated Create Ticket information visually read-only", async () => {
    const { container } = render(<CreateTicket activeRequester={requester} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    await waitFor(() => expect(screen.getByText(/Auto-generated/)).toBeInTheDocument());
    const readonly = container.querySelector(".create-ticket__readonly") as HTMLElement;
    expect(readonly).toHaveStyle({ backgroundColor: "#F0F4F2" });
  });
});
