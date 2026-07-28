# Deterministic Tool Rules

## 1. Priority calculation

Function: `calculatePriority(impact, urgency)`

| Impact | Urgency | Priority |
|---|---|---|
| High | High | P1 |
| High | Medium | P2 |
| High | Low | P2 |
| Medium | High | P2 |
| Medium | Medium | P3 |
| Medium | Low | P3 |
| Low | High | P3 |
| Low | Medium | P4 |
| Low | Low | P4 |

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

### P2 and lower routing

| Category | Team |
|---|---|
| Technical | Technical Support Team |
| Account | Account Support Team |
| Billing | Billing Team |
| Bug | Engineering Team |
| Feature Request | Product Team for P3/P4; Support Team for P2 |
| General or unknown | Support Team |

## 4. Tool boundaries

The current backend does not implement:

- policy-version validation
- security or outage override flags
- `manual_review_required`
- deterministic status-transition logic

These behaviors must not be claimed as implemented until backend support is added.
