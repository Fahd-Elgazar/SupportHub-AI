import type { Ticket } from "../types/ticket";

/**
 * Deterministic fixtures. The interface must work fully on these before
 * it is pointed at the real API — that is the order the handbook asks for,
 * and it means the UI can be demonstrated even when the provider is down.
 *
 * `priority` here matches what calculate_priority_sla() actually returns
 * for each impact/urgency pair.
 */

export const MOCK_BILLING: Ticket = {
  id: 142,
  question: "I paid for the Pro plan yesterday but my account still shows Free.",
  answer:
    "Plan upgrades are applied when the payment provider confirms the charge, which usually completes within one hour. When an account still shows the previous plan after that window, the payment has typically been authorised but not captured, and the subscription record has not been updated.\n\nThe account can be refreshed from the billing record without a second charge. If the charge shows as pending on the customer's statement, it will either capture or expire within 72 hours.",
  source: [
    "Support Policy §4.2 — Billing disputes and plan corrections",
    "Product FAQ — Why hasn't my plan upgraded?",
  ],
  ticket_category: "billing",
  impact: "high",
  urgency: "medium",
  priority: "P2",
  sla: "8 Hours",
  escalation_team: "Billing Team",
  suggested_reply:
    "Hi Sara — thanks for flagging this, and sorry for the confusion. Your Pro payment was authorised yesterday but hasn't finished capturing on our side, which is why the account still shows Free. I've refreshed the billing record and you shouldn't see a second charge. You'll have Pro access within the hour. I'll keep this ticket open until you confirm it looks right.",
  status: "Open",
  created_at: "2026-08-02T09:14:00.000Z",
};

/** No approved source covers the question: escalate rather than fabricate. */
export const MOCK_NO_EVIDENCE: Ticket = {
  id: 143,
  question: "Do you support SAML single sign-on with Okta as the provider?",
  answer: "",
  source: [],
  ticket_category: "other",
  impact: "medium",
  urgency: "medium",
  priority: "P3",
  sla: "24 Hours",
  escalation_team: "Support Team",
  suggested_reply: "",
  status: "Open",
  created_at: "2026-08-02T09:31:00.000Z",
};

/** Highest severity path, to check the P1 treatment. */
export const MOCK_OUTAGE: Ticket = {
  id: 147,
  question: "Everything is down, none of our team can log in at all.",
  answer:
    "A full login failure across an entire workspace is treated as a service-affecting incident rather than an individual account problem. The support policy requires it to be raised to the incident team immediately and acknowledged within four hours.",
  source: ["Support Policy §2.1 — Incident severity definitions"],
  ticket_category: "service_outage",
  impact: "high",
  urgency: "high",
  priority: "P1",
  sla: "4 Hours",
  escalation_team: "Critical Incident Team",
  suggested_reply:
    "Thanks for reporting this — I've raised it as a critical incident and the incident team is looking now. I'll come back to you within the hour with an update, whether or not we have a fix by then.",
  status: "Open",
  created_at: "2026-08-02T08:02:00.000Z",
};

export const MOCK_TICKETS: Ticket[] = [
  MOCK_OUTAGE,
  MOCK_BILLING,
  MOCK_NO_EVIDENCE,
];

/**
 * Picks a fixture from the question text so the mock mode can demonstrate
 * every state without a server. Keywords are documented in the README.
 */
export function pickMockTicket(question: string): Ticket {
  const q = question.toLowerCase();
  if (q.includes("down") || q.includes("outage") || q.includes("log in at all")) {
    return { ...MOCK_OUTAGE, question };
  }
  if (q.includes("saml") || q.includes("sso") || q.includes("okta")) {
    return { ...MOCK_NO_EVIDENCE, question };
  }
  return { ...MOCK_BILLING, question };
}
