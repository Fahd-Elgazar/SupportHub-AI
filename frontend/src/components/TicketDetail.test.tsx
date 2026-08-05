import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TicketDetail from "./TicketDetail";
import { getTicket } from "../lib/api";
import type { Ticket } from "../types/ticket";

vi.mock("../lib/api", () => ({
  getTicket: vi.fn(),
  submitFeedback: vi.fn(),
  updateTicketStatus: vi.fn(),
  getTicketFeedback: vi.fn().mockResolvedValue(null),
}));

const TICKET: Ticket = {
  id: 501,
  question: "Does this support SSO?",
  answer: "Yes, via SAML.",
  source: ["Support Policy §1"],
  ticket_category: "product_question",
  impact: "low",
  urgency: "low",
  priority: "P4",
  sla: "48 Hours",
  escalation_team: "Support Team",
  suggested_reply: "Yes we do.",
  status: "Open",
};

beforeEach(() => {
  vi.mocked(getTicket).mockReset();
});

describe("TicketDetail", () => {
  it("renders the ticket via ResultView when found", async () => {
    vi.mocked(getTicket).mockResolvedValue({ kind: "found", ticket: TICKET });
    render(<TicketDetail id={501} onBack={vi.fn()} />);
    expect(await screen.findByText("TCK-0501")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id (the 404 case)", async () => {
    vi.mocked(getTicket).mockResolvedValue({ kind: "not_found" });
    render(<TicketDetail id={9999} onBack={vi.fn()} />);
    expect(await screen.findByText("Ticket not found")).toBeInTheDocument();
    expect(screen.getByText(/TCK-9999/)).toBeInTheDocument();
  });

  it("shows a retry-able error state on failure", async () => {
    vi.mocked(getTicket).mockResolvedValue({ kind: "error", message: "Could not load this ticket." });
    render(<TicketDetail id={1} onBack={vi.fn()} />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
