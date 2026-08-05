/**
 * Typed mirror of the SupportHub Express API contract.
 *
 * Source of truth: schemas/supportResponse.schema.js, schemas/supportRequest.schema.js
 * and schemas/feedback.schema.js on the `backend` branch.
 *
 * If any of these unions stop matching the server, the compiler should be the
 * first thing that complains — not the UI at runtime.
 */

export const TICKET_CATEGORIES = [
  "account_access",
  "technical_issue",
  "billing",
  "product_question",
  "security",
  "service_outage",
  "other",
] as const;

export const LEVELS = ["low", "medium", "high"] as const;
export const PRIORITIES = ["P1", "P2", "P3", "P4"] as const;
export const STATUSES = ["Open", "In Progress", "Resolved", "Closed"] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type Level = (typeof LEVELS)[number];
export type Priority = (typeof PRIORITIES)[number];
export type TicketStatus = (typeof STATUSES)[number];

/** Server-side validation limits on `question`. Must match the Joi schema. */
export const QUESTION_MIN = 5;
export const QUESTION_MAX = 2000;

/** POST /api/supporthub-ai request body. */
export interface SupportRequest {
  question: string;
}

/** A triaged ticket as returned inside `data`. */
export interface Ticket {
  id: number;
  question: string;
  answer: string;
  /** Array of approved source labels. May be empty. */
  source: string[];
  ticket_category: TicketCategory;
  impact: Level;
  urgency: Level;
  priority: Priority;
  /** Human string such as "8 Hours" — not a number. */
  sla: string;
  escalation_team: string;
  suggested_reply: string;
  status: TicketStatus;
  created_at?: string;
}

/** POST /api/supporthub-ai/feedback request body. */
export interface FeedbackRequest {
  ticket_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

/** A feedback row as returned by GET /ticket/:id/feedback. */
export interface Feedback {
  id: number;
  ticket_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  created_at?: string;
}

/* -------------------------------------------------------------------------- */
/* Response envelopes                                                          */
/* -------------------------------------------------------------------------- */

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
  count?: number;
}

/** 400 from the validate middleware: `errors` is an array of plain strings. */
export interface ApiValidationError {
  success: false;
  errors: string[];
}

/** 404 / 500 from the controller or global error handler. */
export interface ApiMessageError {
  success: false;
  message: string;
}

export type ApiError = ApiValidationError | ApiMessageError;

/* -------------------------------------------------------------------------- */
/* Discriminated result the UI actually renders                                */
/* -------------------------------------------------------------------------- */

export type RequestState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; ticket: Ticket }
  /** Recoverable: the agent fixes the input. */
  | { kind: "invalid"; errors: string[] }
  /** Not recoverable by editing: retry or proceed manually. */
  | { kind: "failed"; message: string };

export function isValidationError(e: ApiError): e is ApiValidationError {
  return Array.isArray((e as ApiValidationError).errors);
}
