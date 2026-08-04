# Deterministic Tool Rules

## 1. Priority calculation

Function: `calculatePriority(impact, urgency)`

| Impact | Urgency | Priority |
|---|---|---|
| high | high | P1 |
| high | medium | P2 |
| high | low | P2 |
| medium | high | P2 |
| medium | medium | P3 |
| medium | low | P3 |
| low | high | P3 |
| low | medium | P4 |
| low | low | P4 |

Current fallback behavior: an unsupported impact or urgency value returns `P4`.

## 2. SLA calculation

Function: `calculateSLA(priority)`

| Priority | SLA |
|---|---|
| P1 | `4 Hours` |
| P2 | `8 Hours` |
| P3 | `24 Hours` |
| P4 | `48 Hours` |

Current fallback behavior: an unsupported priority returns `48 Hours`.

## 3. Escalation routing

Function: `getEscalationTeam(priority, category)`

### P1 override

Every `P1` ticket routes to `Critical Incident Team`, regardless of category.

### P2 routing

| Category | Team |
|---|---|
| `technical_issue` | Technical Support Team |
| `account_access` | Account Support Team |
| `billing` | Billing Team |
| Any other category (`product_question`, `security`, `service_outage`, `other`) | Support Team |

### P3/P4 routing

| Category | Team |
|---|---|
| `technical_issue` | Technical Support Team |
| `billing` | Billing Team |
| `account_access` | Account Support Team |
| `product_question` | Product Team |
| Any other category (`security`, `service_outage`, `other`) | Support Team |

`security` and `service_outage` have no dedicated escalation team at any priority below P1 — they route to the generic Support Team. This is a known gap (see Known Limitations), not an oversight in this document: giving them dedicated routing would be a product decision, not a bug fix, and hasn't been made yet.

## 4. Tool boundaries

The current backend does not implement:

- policy-version validation
- security or outage override flags
- `manual_review_required`
- deterministic status-transition logic

These behaviors must not be claimed as implemented until backend support is added.
