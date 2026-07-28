# SupportHub AI Ticket Taxonomy

## Ticket Categories

| ID | Description | Examples | Exclusions |
|---|---|---|---|
| account_access | Login, password, or account access | Password reset, locked account | Security compromise |
| technical_issue | Product malfunction or incorrect behavior | Application crash, failed upload | Platform-wide outage |
| billing | Invoice, payment, subscription, or refund issue | Missing invoice, payment failure | General product question |
| product_question | Request for approved product information | Feature usage, account settings | Unsupported future roadmap |
| security | Suspected compromise, exposure, or security concern | Stolen credentials, leaked data | Normal password reset |
| service_outage | Broad loss of service | Platform unavailable for many users | Single-user technical issue |
| other | Valid issue that does not match an approved category | Uncategorized request | Empty input |

## Impact

| Value | Definition |
|---|---|
| low | One user or minor inconvenience |
| medium | Several users or meaningful workflow disruption |
| high | Broad business impact, security concern, or major service loss |

## Urgency

| Value | Definition |
|---|---|
| low | Workaround exists and delay is acceptable |
| medium | Timely response is needed |
| high | Immediate action is required |

## Priority

- P1 — Critical
- P2 — High
- P3 — Medium
- P4 — Low

## Ticket Status

- new
- triaged
- waiting_for_agent
- in_progress
- waiting_for_customer
- resolved
- closed
- manual_review

## Unknown Value Behavior

- Unknown categories must not be guessed.
- Unknown category values route to manual review.
- Invalid impact or urgency values produce validation errors.
- AI-proposed values must be checked against this taxonomy.
