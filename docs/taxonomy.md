# SupportHub AI Ticket Taxonomy

## Purpose

This document defines the approved taxonomy used to classify support tickets within SupportHub AI. It provides the allowed categories, impact and urgency levels, ticket statuses, and validation rules used throughout the application.

The AI may propose values from this taxonomy, but every proposed value must be validated before it is accepted by the application.

---

# Ticket Categories

Only the following ticket categories are valid.

| Category ID | Description | Examples | Exclusions |
|-------------|-------------|----------|------------|
| account_access | Login, password, authentication, or account access issues | Password reset, locked account, MFA problems | Security compromise or suspected account takeover |
| technical_issue | Product malfunction or unexpected system behavior | Application crash, upload failure, API error | Platform-wide outage |
| billing | Payment, invoices, subscriptions, refunds, or licensing | Missing invoice, payment failed, subscription renewal | General product usage questions |
| product_question | Questions about approved product functionality or configuration | Feature usage, account settings | Future roadmap requests or unsupported features |
| security | Security incidents or suspected compromise | Stolen credentials, suspicious login, exposed data | Routine password reset |
| service_outage | Platform-wide service interruption | Multiple users unable to access the service | Single-user technical issue |
| other | Valid request that cannot be classified using an approved category | Uncategorized support request | Empty or invalid input |

---

# Impact Levels

Impact measures **how many users or business processes are affected**.

| Value | Definition |
|--------|------------|
| low | One user or a minor inconvenience |
| medium | Multiple users or a significant workflow disruption |
| high | Organization-wide impact, major service disruption, or security incident |

---

# Urgency Levels

Urgency measures **how quickly action is required**.

| Value | Definition |
|--------|------------|
| low | Resolution can reasonably wait |
| medium | Timely action is required |
| high | Immediate action is required to reduce business impact |

---

# Priority

Priority is **not classified by the AI**.

Priority is calculated deterministically using:

- Impact
- Urgency
- Approved priority matrix
- Current policy version

Allowed priority values:

- P1 — Critical
- P2 — High
- P3 — Medium
- P4 — Low

---

# Ticket Status

Only the following ticket states are valid.

| Status | Description |
|---------|-------------|
| new | Ticket has been created but not reviewed |
| triaged | Initial classification has been completed |
| waiting_for_agent | Awaiting assignment or agent action |
| in_progress | Agent is actively working on the ticket |
| waiting_for_customer | Additional customer information is required |
| resolved | Proposed solution has been provided |
| closed | Resolution has been confirmed and ticket is complete |
| manual_review | Human review is required before further processing |

---

# Classification Rules

The AI may propose:

- ticket_category
- impact
- urgency

The application is responsible for:

- validating proposed values
- calculating priority
- calculating SLA
- determining escalation
- controlling ticket status transitions

---

# Validation Rules

The application must enforce the following rules:

1. Only values defined in this document are valid.
2. Category names are case-sensitive.
3. Unknown category values must not be guessed.
4. Invalid impact values must produce a validation error.
5. Invalid urgency values must produce a validation error.
6. Empty category values require manual review.
7. AI-generated values outside this taxonomy must be rejected.

---

# Unknown Value Behavior

| Situation | Expected Behavior |
|-----------|-------------------|
| Unknown category | Route to manual review |
| Unknown impact | Validation error |
| Unknown urgency | Validation error |
| Unknown status | Reject status transition |
| Unknown priority | Reject deterministic calculation |

---

# Future Extensions

Additional ticket categories should only be introduced after approval by the project team.

New categories must include:

- Category ID
- Description
- Examples
- Exclusions
- Updated routing rules
- Updated evaluation cases
- Updated deterministic tests

No undocumented category should be used in production.
