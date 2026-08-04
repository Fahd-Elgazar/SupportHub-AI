import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AskForm from "./AskForm";

describe("AskForm validation", () => {
  it("does not show an error just from blurring an invalid field (regression: onBlur used to trigger it)", async () => {
    const user = userEvent.setup();
    render(<AskForm onSubmit={vi.fn()} loading={false} />);
    await user.type(screen.getByRole("textbox"), "hi");
    await user.tab();
    expect(screen.queryByText(/must contain at least/i)).not.toBeInTheDocument();
  });

  it("rejects an empty submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskForm onSubmit={onSubmit} loading={false} />);
    await user.click(screen.getByRole("button", { name: /get grounded answer/i }));
    expect(screen.getByText("Question cannot be empty.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a submission below the minimum length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskForm onSubmit={onSubmit} loading={false} />);
    await user.type(screen.getByRole("textbox"), "hi");
    await user.click(screen.getByRole("button", { name: /get grounded answer/i }));
    expect(screen.getByText("Question must contain at least 5 characters.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts a submission at exactly the minimum length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskForm onSubmit={onSubmit} loading={false} />);
    await user.type(screen.getByRole("textbox"), "abcde");
    await user.click(screen.getByRole("button", { name: /get grounded answer/i }));
    expect(onSubmit).toHaveBeenCalledWith("abcde");
  });

  it("rejects a submission one character over the maximum length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskForm onSubmit={onSubmit} loading={false} />);
    await user.click(screen.getByRole("textbox"));
    await user.paste("a".repeat(2001));
    await user.click(screen.getByRole("button", { name: /get grounded answer/i }));
    expect(screen.getByText("Question exceeds maximum length.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts a submission at exactly the maximum length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const maxText = "a".repeat(2000);
    render(<AskForm onSubmit={onSubmit} loading={false} />);
    await user.click(screen.getByRole("textbox"));
    await user.paste(maxText);
    await user.click(screen.getByRole("button", { name: /get grounded answer/i }));
    expect(onSubmit).toHaveBeenCalledWith(maxText);
  });

  it("prefers server-provided errors over the local validation message", () => {
    render(<AskForm onSubmit={vi.fn()} loading={false} serverErrors={["Server says no."]} />);
    expect(screen.getByText("Server says no.")).toBeInTheDocument();
  });
});
