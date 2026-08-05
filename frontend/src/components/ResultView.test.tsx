import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultView from "./ResultView";
import { updateTicketStatus } from "../lib/api";
import { MOCK_BILLING } from "../lib/mockData";
import type { Ticket } from "../types/ticket";

vi.mock("../lib/api", () => ({
  submitFeedback: vi.fn(),
  updateTicketStatus: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(updateTicketStatus).mockReset();
});

describe("ResultView — customer mode", () => {
  it("does not show agent-only tools", () => {
    render(<ResultView ticket={MOCK_BILLING} mode="customer" />);

    expect(screen.queryByText("Escalation team")).not.toBeInTheDocument();
    expect(screen.queryByText(/escalate to/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/reply to the customer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/rate this ai-generated answer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(`${MOCK_BILLING.priority} · ${MOCK_BILLING.sla}`)).not.toBeInTheDocument();
  });

  it("still shows the answer and a plain confirmation", () => {
    render(<ResultView ticket={MOCK_BILLING} mode="customer" />);

    expect(screen.getByText(/plan upgrades are applied/i)).toBeInTheDocument();
    expect(screen.getByText(/your request has been logged/i)).toBeInTheDocument();
  });
});

describe("ResultView — agent mode", () => {
  it("shows the full triage workspace", () => {
    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);

    expect(screen.getByText("Escalation team")).toBeInTheDocument();
    expect(screen.getByText(/reply to the customer/i)).toBeInTheDocument();
    expect(screen.getByText(/rate this ai-generated answer/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /escalate to billing team/i })).toBeInTheDocument();
  });

  it("escalates an Open ticket to In Progress and calls onTicketChange", async () => {
    const updated: Ticket = { ...MOCK_BILLING, status: "In Progress" };
    vi.mocked(updateTicketStatus).mockResolvedValue(updated);
    const onTicketChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultView ticket={MOCK_BILLING} mode="agent" onTicketChange={onTicketChange} />
    );

    await user.click(screen.getByRole("button", { name: /escalate to billing team/i }));

    expect(updateTicketStatus).toHaveBeenCalledWith(MOCK_BILLING.id, "In Progress");
    expect(onTicketChange).toHaveBeenCalledWith(updated);
    expect(await screen.findByRole("button", { name: /mark resolved/i })).toBeInTheDocument();
  });

  it("shows an inline error and keeps the action available if the status update fails", async () => {
    vi.mocked(updateTicketStatus).mockResolvedValue(null);
    const user = userEvent.setup();

    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);
    await user.click(screen.getByRole("button", { name: /escalate to billing team/i }));

    expect(await screen.findByText(/couldn.t update status/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /escalate to billing team/i })).toBeInTheDocument();
  });
});
