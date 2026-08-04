import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PriorityMatrix from "./PriorityMatrix";

describe("PriorityMatrix", () => {
  it("marks the cell matching impact and urgency as the active cell", () => {
    render(
      <PriorityMatrix
        impact="high"
        urgency="medium"
        priority="P2"
        escalationTeam="Billing Team"
        category="billing"
      />
    );
    const activeCell = screen.getByRole("cell", { current: true });
    expect(activeCell).toHaveTextContent("P2");
    expect(activeCell).toHaveClass("on", "p-p2");
  });

  it("does not flag a mismatch when the server priority matches the matrix", () => {
    render(
      <PriorityMatrix
        impact="high"
        urgency="medium"
        priority="P2"
        escalationTeam="Billing Team"
        category="billing"
      />
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("flags a mismatch when the server priority disagrees with the matrix (the known P4 bug)", () => {
    render(
      <PriorityMatrix
        impact="low"
        urgency="low"
        priority="P1"
        escalationTeam="Support Team"
        category="other"
      />
    );
    const flag = screen.getByRole("status");
    expect(flag.textContent).toMatch(/the server returned p1, but this pairing should give p4/i);
  });
});
