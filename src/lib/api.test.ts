import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Ticket } from "../types/ticket";

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const SAMPLE_TICKET: Ticket = {
  id: 501,
  question: "Does the API support webhooks?",
  answer: "",
  source: [],
  ticket_category: "product_question",
  impact: "low",
  urgency: "low",
  priority: "P4",
  sla: "48 Hours",
  escalation_team: "Support Team",
  suggested_reply: "",
  status: "Open",
};

describe("getTicket — mock mode (VITE_USE_MOCK=true, the project default)", () => {
  it("finds an existing mock fixture by id", async () => {
    const { getTicket } = await import("../lib/api");
    const result = await getTicket(147); // MOCK_OUTAGE's id
    expect(result.kind).toBe("found");
  });

  it("returns not_found for an id with no fixture — this is the 404 case a real backend would 404 on", async () => {
    const { getTicket } = await import("../lib/api");
    expect(await getTicket(999999)).toEqual({ kind: "not_found" });
  });
});

describe("getTicket — real API mode", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_USE_MOCK", "false");
  });

  it("returns not_found on a 404 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );
    const { getTicket } = await import("../lib/api");
    expect(await getTicket(9999)).toEqual({ kind: "not_found" });
  });

  it("returns the ticket on a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: SAMPLE_TICKET }),
      })
    );
    const { getTicket } = await import("../lib/api");
    expect(await getTicket(SAMPLE_TICKET.id)).toEqual({ kind: "found", ticket: SAMPLE_TICKET });
  });

  it("returns an error on a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { getTicket } = await import("../lib/api");
    expect((await getTicket(1)).kind).toBe("error");
  });

  it("returns an error on a non-404 failure status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
    );
    const { getTicket } = await import("../lib/api");
    expect((await getTicket(1)).kind).toBe("error");
  });
});
