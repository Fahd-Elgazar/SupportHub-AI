# Deterministic Tool Rules

## calculate_priority_sla()

Priority depends only on Impact and Urgency.

| Impact | Urgency | Priority | SLA |
|---------|----------|----------|---------|
| High | High | P1 | 1 hour |
| High | Medium | P2 | 4 hours |
| Medium | High | P2 | 4 hours |
| Medium | Medium | P3 | 8 hours |
| Low | High | P3 | 8 hours |
| Low | Medium | P4 | 24 hours |
| Low | Low | P4 | 24 hours |

---

## route_escalation()

| Category | Assigned Team |
|----------|---------------|
| account_access | Identity Support |
| technical_issue | Technical Support |
| billing | Billing Support |
| product_question | Product Support |
| security | Security Team |
| service_outage | Incident Response |
| other | General Support |

Rules

- Security always routes to Security Team.
- Unknown categories require manual review.
- High-risk tickets cannot be automatically closed.
