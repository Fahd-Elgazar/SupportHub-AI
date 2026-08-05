import type {
  ApiError,
  Feedback,
  FeedbackRequest,
  RequestState,
  Ticket,
  TicketStatus,
} from "../types/ticket";
import { isValidationError } from "../types/ticket";
import { pickMockTicket, MOCK_TICKETS } from "./mockData";

const BASE = import.meta.env.VITE_API_BASE ?? "/api/supporthub-ai";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const TIMEOUT_MS = 30_000;

/** Message shown when the provider or server fails. Never leaks server internals. */
const FAILED_MESSAGE =
  "The answer service didn't respond. Your question is saved — try again, or file the ticket without an AI answer.";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Wraps fetch with a timeout. The model call can hang; a spinner that never
 * resolves is worse than an error the agent can act on.
 */
async function request(path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${BASE}${path}`, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * POST / — ask a support question and receive a triaged ticket.
 *
 * Returns a RequestState rather than throwing, so every outcome the UI can
 * render is represented in the type and none can be forgotten.
 */
export async function askSupport(question: string): Promise<RequestState> {
  if (USE_MOCK) {
    await delay(900);
    return { kind: "success", ticket: pickMockTicket(question) };
  }

  let res: Response;
  try {
    res = await request("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch {
    // Network failure, timeout, or CORS rejection all land here.
    return { kind: "failed", message: FAILED_MESSAGE };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { kind: "failed", message: FAILED_MESSAGE };
  }

  if (res.ok) {
    const ok = body as { data?: Ticket };
    if (!ok.data) return { kind: "failed", message: FAILED_MESSAGE };
    return { kind: "success", ticket: ok.data };
  }

  if (res.status === 400) {
    const err = body as ApiError;
    return {
      kind: "invalid",
      errors: isValidationError(err)
        ? err.errors
        : ["That question couldn't be accepted. Check the length and try again."],
    };
  }

  return { kind: "failed", message: FAILED_MESSAGE };
}

/** GET /tickets — the triage queue. */
export async function getTickets(): Promise<Ticket[]> {
  if (USE_MOCK) {
    await delay(500);
    return MOCK_TICKETS;
  }
  const res = await request("/tickets", { method: "GET" });
  if (!res.ok) throw new Error("Could not load the queue.");
  const body = (await res.json()) as { data?: Ticket[] };
  return body.data ?? [];
}

export type TicketLookup =
  | { kind: "found"; ticket: Ticket }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

/** GET /ticket/:id — a single ticket's detail. 404 is a normal, expected outcome here. */
export async function getTicket(id: number): Promise<TicketLookup> {
  if (USE_MOCK) {
    await delay(400);
    const match = MOCK_TICKETS.find((t) => t.id === id);
    return match ? { kind: "found", ticket: match } : { kind: "not_found" };
  }

  let res: Response;
  try {
    res = await request(`/ticket/${id}`, { method: "GET" });
  } catch {
    return { kind: "error", message: "Could not load this ticket." };
  }

  if (res.status === 404) return { kind: "not_found" };
  if (!res.ok) return { kind: "error", message: "Could not load this ticket." };

  const body = (await res.json()) as { data?: Ticket };
  return body.data
    ? { kind: "found", ticket: body.data }
    : { kind: "error", message: "Could not load this ticket." };
}

/**
 * POST /feedback — returns 201 on success.
 * `ticket_id` must be the integer id from the ticket response, so the
 * caller has to keep the ticket in state.
 */
export async function submitFeedback(input: FeedbackRequest): Promise<boolean> {
  if (USE_MOCK) {
    await delay(400);
    return true;
  }
  try {
    const res = await request("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return res.status === 201;
  } catch {
    // Network failure, timeout, or CORS rejection — same treatment as the
    // other endpoints: a caught failure, not an unhandled rejection.
    return false;
  }
}

/**
 * PATCH /ticket/:id/status — moves a ticket through its lifecycle
 * (Escalate, Mark Resolved, Send Reply). `reply` is optional and only
 * sent by "Send Reply", which saves the edited reply alongside the status
 * change. Returns the updated ticket on success, or null on any failure —
 * the caller decides how to surface that, same pattern as the other
 * functions here.
 */
export async function updateTicketStatus(
  id: number,
  status: TicketStatus,
  reply?: string
): Promise<Ticket | null> {
  if (USE_MOCK) {
    await delay(300);
    const match = MOCK_TICKETS.find((t) => t.id === id);
    if (!match) return null;
    return { ...match, status, ...(reply !== undefined ? { suggested_reply: reply } : {}) };
  }
  try {
    const res = await request(`/ticket/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reply !== undefined ? { status, reply } : { status }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Ticket };
    return body.data ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /ticket/:id/feedback — the most recent feedback already recorded
 * for this ticket, or null if there is none (or the check failed). Used
 * to preload the feedback form so re-opening an already-rated ticket
 * shows what was submitted instead of a blank form.
 */
export async function getTicketFeedback(ticketId: number): Promise<Feedback | null> {
  if (USE_MOCK) {
    await delay(200);
    return null;
  }
  try {
    const res = await request(`/ticket/${ticketId}/feedback`, { method: "GET" });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Feedback[] };
    return body.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export const usingMockData = USE_MOCK;
