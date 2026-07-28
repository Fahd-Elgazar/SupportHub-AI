# Deterministic Tool Rules

## Purpose

This document defines the deterministic business rules executed by the SupportHub AI application.

These rules are implemented by backend application logic and are not controlled by the language model.

Their purpose is to ensure that identical validated inputs always produce identical outputs regardless of the AI model being used.

---

# Design Principles

The deterministic layer is responsible for:

- input validation
- business rule enforcement
- priority calculation
- SLA calculation
- escalation routing
- status transitions
- audit logging

The AI is responsible only for proposing information.

The application is responsible for making authoritative decisions.

---

# AI Boundary

The AI may propose:

- ticket_category
- impact
- urgency
- suggested_reply
- answer

The AI must never determine:

- priority
- SLA
- escalation team
- ticket status
- security overrides
- routing decisions

---

# Execution Order

Every ticket should follow the same deterministic workflow.

1. Validate input.
2. Validate taxonomy values.
3. Calculate priority.
4. Calculate SLA.
5. Determine escalation.
6. Validate status transition.
7. Record audit information.
8. Return the final ticket.

---

# calculate_priority_sla()

## Input

- validated impact
- validated urgency
- policy version
- calculation timestamp

## Output

- priority
- SLA policy
- calculation reason
- manual review flag

---

## Proposed Priority Matrix

| Impact | Urgency | Priority | SLA |
|---------|----------|----------|-----|
| high | high | P1 | Team confirmation required |
| high | medium | P2 | Team confirmation required |
| high | low | P2 | Team confirmation required |
| medium | high | P2 | Team confirmation required |
| medium | medium | P3 | Team confirmation required |
| medium | low | P3 | Team confirmation required |
| low | high | P3 | Team confirmation required |
| low | medium | P4 | Team confirmation required |
| low | low | P4 | Team confirmation required |

The priority matrix is proposed and remains subject to team approval.

---

## Validation Rules

Before calculation:

- impact must exist
- urgency must exist
- both values must belong to the approved taxonomy
- policy version must exist

Invalid requests must not continue to calculation.

---

## Failure Behaviour

If:

- impact is missing
- urgency is missing
- taxonomy validation fails
- policy version is unknown
- matrix lookup fails

then:

- preserve the ticket
- return manual review
- record the failure
- do not invent a priority

---

# route_escalation()

## Input

- validated ticket category
- validated priority
- security flag
- outage flag
- routing policy version

## Output

- escalation team
- escalation required
- manual review flag
- routing reason

---

## Default Routing

| Category | Team |
|----------|------|
| account_access | Account Support |
| technical_issue | Technical Support |
| billing | Billing Support |
| product_question | Product Support |
| security | Security Team |
| service_outage | Incident Response Team |
| other | Manual Triage Queue |

---

## Rule Precedence

The router evaluates rules in the following order:

1. Security override
2. Critical outage override
3. High-risk override
4. Category routing
5. Manual review fallback

Only the first matching rule is applied.

---

## Failure Behaviour

The router must never:

- invent a team
- invent routing logic
- ignore security overrides
- silently continue after failure

Unknown routing conditions require manual review.

---

# Status Rules

The application controls all ticket state transitions.

The AI has no authority to modify ticket status.

Rules:

- AI cannot close tickets.
- High-risk tickets cannot be automatically closed.
- Security tickets require human confirmation.
- Invalid transitions must be rejected.
- Failed deterministic tools prevent automatic closure.

---

# Audit Requirements

Every deterministic decision should record:

- timestamp
- policy version
- validated input
- calculated priority
- routing decision
- reason code
- manual review flag

Audit records should allow deterministic decisions to be reproduced during investigation.

---

# Deterministic Guarantee

For identical validated inputs and the same policy version, the deterministic layer must always produce identical outputs.

Changes to outputs require a documented policy update rather than AI behaviour changes.
