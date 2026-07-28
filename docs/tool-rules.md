# Deterministic Tool Rules

## Important Boundary

These rules are executed by application logic.

The AI may propose category, impact, and urgency, but it must not directly control priority, SLA, escalation team, or final status.

---

## calculate_priority_sla()

### Input

- validated impact
- validated urgency
- policy version
- calculation timestamp

### Proposed Priority Matrix

| Impact | Urgency | Priority | SLA |
|---|---|---|---|
| high | high | P1 | Team confirmation required |
| high | medium | P2 | Team confirmation required |
| high | low | P2 | Team confirmation required |
| medium | high | P2 | Team confirmation required |
| medium | medium | P3 | Team confirmation required |
| medium | low | P3 | Team confirmation required |
| low | high | P3 | Team confirmation required |
| low | medium | P4 | Team confirmation required |
| low | low | P4 | Team confirmation required |

The priority values and SLA targets remain proposed until approved by the team lead.

### Failure Rules

- Missing impact: validation failure or manual review.
- Missing urgency: validation failure or manual review.
- Invalid enum: validation failure.
- Unknown policy version: fail closed.
- Missing matrix row: manual review.
- Tool failure: preserve the ticket and require manual review.

---

## route_escalation()

### Proposed Routing

| Category | Default Team |
|---|---|
| account_access | Account Support |
| technical_issue | Technical Support |
| billing | Billing Support |
| product_question | Product Support |
| security | Security Team |
| service_outage | Incident Response Team |
| other | Manual Triage Queue |

### Proposed Rule Precedence

1. Security issue routes to Security Team.
2. Critical service outage routes to Incident Response Team.
3. Other high-risk issue requires manual review.
4. Otherwise, use category routing.
5. Unknown category routes to Manual Triage Queue.

### Failure Rules

- The router must not guess an unknown team.
- AI-provided team names must be ignored.
- A missing routing rule requires manual review.
- Routing failures must not delete or close the ticket.

---

## Status Rules

- AI cannot close tickets.
- Security and high-risk tickets cannot be auto-closed.
- Failed tool execution prevents automatic closure.
- An agent must confirm resolution before closure.
- Invalid status transitions must be rejected.
