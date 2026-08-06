import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultView from "./ResultView";
import { getTicketFeedback, updateTicketStatus } from "../lib/api";
import { MOCK_BILLING, MOCK_NO_EVIDENCE } from "../lib/mockData";
import type { Feedback, Ticket } from "../types/ticket";

vi.mock("../lib/api", () => ({
  submitFeedback: vi.fn(),
  updateTicketStatus: vi.fn(),
  getTicketFeedback: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(updateTicketStatus).mockReset();
  vi.mocked(getTicketFeedback).mockReset();
  vi.mocked(getTicketFeedback).mockResolvedValue(null);
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
  it("shows the full triage workspace", async () => {
    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);

    expect(screen.getByText("Escalation team")).toBeInTheDocument();
    expect(screen.getByText(/reply to the customer/i)).toBeInTheDocument();
    expect(await screen.findByText(/rate this ai-generated answer/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /escalate to billing team/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reply/i })).toBeInTheDocument();
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
    // Grounded ticket: the generic "Mark resolved" is intentionally hidden
    // once there's a reply to send instead — "Send reply" is the path.
    expect(screen.queryByRole("button", { name: /mark resolved/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reply/i })).toBeInTheDocument();
    // The status change is no longer silent — a confirmation names the team and new status.
    expect(
      screen.getByText(/escalated to billing team\. status changed to in progress/i)
    ).toBeInTheDocument();
  });

  it("shows the generic Mark resolved action for an ungrounded ticket instead", async () => {
    const inProgress: Ticket = { ...MOCK_NO_EVIDENCE, status: "In Progress" };
    render(<ResultView ticket={inProgress} mode="agent" />);

    expect(screen.getByRole("button", { name: /mark resolved/i })).toBeInTheDocument();
    // No ReplyEditor for an ungrounded ticket, so no competing "Send reply".
    expect(screen.queryByRole("button", { name: /send reply/i })).not.toBeInTheDocument();
  });

  it("shows an inline error and keeps the action available if the status update fails", async () => {
    vi.mocked(updateTicketStatus).mockResolvedValue(null);
    const user = userEvent.setup();

    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);
    await user.click(screen.getByRole("button", { name: /escalate to billing team/i }));

    expect(await screen.findByText(/couldn.t update status/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /escalate to billing team/i })).toBeInTheDocument();
  });

  it("sends the edited reply, marks the ticket Resolved, and locks the editor", async () => {
    const updated: Ticket = {
      ...MOCK_BILLING,
      status: "Resolved",
      suggested_reply: "An edited reply.",
    };
    vi.mocked(updateTicketStatus).mockResolvedValue(updated);
    const onTicketChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultView ticket={MOCK_BILLING} mode="agent" onTicketChange={onTicketChange} />
    );

    const textarea = screen.getByLabelText(/reply to the customer/i);
    await user.clear(textarea);
    await user.type(textarea, "An edited reply.");
    await user.click(screen.getByRole("button", { name: /send reply/i }));

    expect(updateTicketStatus).toHaveBeenCalledWith(
      MOCK_BILLING.id,
      "Resolved",
      "An edited reply."
    );
    expect(onTicketChange).toHaveBeenCalledWith(updated);
    expect(
      await screen.findByText(/reply sent successfully \(simulated\)/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send reply/i })).not.toBeInTheDocument();
  });

  it("preloads existing feedback instead of showing a blank form", async () => {
    const existing: Feedback = {
      id: 1,
      ticket_id: MOCK_BILLING.id,
      rating: 4,
      comment: "Mostly right",
    };
    vi.mocked(getTicketFeedback).mockResolvedValue(existing);

    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);

    expect(
      await screen.findByText(/feedback recorded — rated 4\/5/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/mostly right/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /submit feedback/i })).not.toBeInTheDocument();
  });

  it("shows the normal rating form when there is no existing feedback", async () => {
    vi.mocked(getTicketFeedback).mockResolvedValue(null);

    render(<ResultView ticket={MOCK_BILLING} mode="agent" />);

    expect(
      await screen.findByRole("button", { name: /submit feedback/i })
    ).toBeInTheDocument();
  });
});
