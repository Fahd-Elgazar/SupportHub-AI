import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketQueue from "./TicketQueue";
import { getTickets } from "../lib/api";
import type { Ticket } from "../types/ticket";

vi.mock("../lib/api", () => ({
  getTickets: vi.fn(),
}));

const TICKETS: Ticket[] = [
  {
    id: 1,
    question: "Everything is down",
    answer: "",
    source: [],
    ticket_category: "service_outage",
    impact: "high",
    urgency: "high",
    priority: "P1",
    sla: "4 Hours",
    escalation_team: "Critical Incident Team",
    suggested_reply: "",
    status: "Open",
  },
  {
    id: 2,
    question: "Billing question",
    answer: "",
    source: [],
    ticket_category: "billing",
    impact: "high",
    urgency: "medium",
    priority: "P2",
    sla: "8 Hours",
    escalation_team: "Billing Team",
    suggested_reply: "",
    status: "Closed",
  },
];

beforeEach(() => {
  vi.mocked(getTickets).mockReset();
});

describe("TicketQueue filters", () => {
  it("renders every ticket with no filters applied", async () => {
    vi.mocked(getTickets).mockResolvedValue(TICKETS);
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    expect(await screen.findByText("Showing 2 of 2 tickets")).toBeInTheDocument();
  });

  it("narrows results with a priority filter", async () => {
    vi.mocked(getTickets).mockResolvedValue(TICKETS);
    const user = userEvent.setup();
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    await screen.findByText("Showing 2 of 2 tickets");
    await user.click(screen.getByRole("button", { name: "P1" }));
    expect(screen.getByText("Showing 1 of 2 tickets")).toBeInTheDocument();
  });

  it("ANDs across priority and status filters, and shows the filtered-empty state at zero", async () => {
    vi.mocked(getTickets).mockResolvedValue(TICKETS);
    const user = userEvent.setup();
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    await screen.findByText("Showing 2 of 2 tickets");
    await user.click(screen.getByRole("button", { name: "P1" }));
    await user.click(screen.getByRole("button", { name: "Closed" }));
    expect(screen.getByText("Showing 0 of 2 tickets")).toBeInTheDocument();
    expect(screen.getByText("No tickets match these filters")).toBeInTheDocument();
  });

  it("clears filters back to the full list", async () => {
    vi.mocked(getTickets).mockResolvedValue(TICKETS);
    const user = userEvent.setup();
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    await screen.findByText("Showing 2 of 2 tickets");
    await user.click(screen.getByRole("button", { name: "P1" }));
    await user.click(screen.getByRole("button", { name: "Closed" }));
    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(screen.getByText("Showing 2 of 2 tickets")).toBeInTheDocument();
  });

  it("shows the true-empty state, distinct from the filtered-empty state", async () => {
    vi.mocked(getTickets).mockResolvedValue([]);
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    expect(await screen.findByText("No tickets in the queue")).toBeInTheDocument();
  });

  it("shows a retry-able error state when the fetch fails", async () => {
    vi.mocked(getTickets).mockRejectedValue(new Error("boom"));
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={vi.fn()} />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("calls onSelectTicket with the ticket id when a row is clicked", async () => {
    vi.mocked(getTickets).mockResolvedValue(TICKETS);
    const user = userEvent.setup();
    const onSelectTicket = vi.fn();
    render(<TicketQueue onAsk={vi.fn()} onSelectTicket={onSelectTicket} />);
    await screen.findByText("Showing 2 of 2 tickets");
    await user.click(screen.getByText("Everything is down"));
    expect(onSelectTicket).toHaveBeenCalledWith(1);
  });
});
