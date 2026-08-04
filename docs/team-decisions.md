# Team Decisions

## Purpose

This document tracks project decisions that require formal approval before they become part of the SupportHub AI specification.

Items marked as **Pending** represent proposals only and must not be implemented as production policy until approved by the designated owner.

---

## Decision Register

| ID | Decision | Proposed Position | Owner | Status |
|----|----------|-------------------|-------|--------|
| DEC-01 | Final ticket categories | Use the categories defined in `taxonomy.md`. | Team Lead | Pending |
| DEC-02 | Priority matrix | Use the proposed P1–P4 priority matrix. | Team Lead | Pending |
| DEC-03 | SLA duration for each priority | Define response targets for each priority level. | Product Owner | Pending |
| DEC-04 | SLA meaning | Determine whether SLA measures first response, resolution, or both. | Product Owner | Pending |
| DEC-05 | SLA calendar | Decide whether SLA calculations use business hours or calendar hours. | Product Owner | Pending |
| DEC-06 | Source approval authority | Assign responsibility for approving, updating, and retiring knowledge sources. | Team Lead | Pending |
| DEC-07 | Source conflict precedence | Support Policy → Troubleshooting Guide → FAQ. | Team Lead | Pending |
| DEC-08 | Human approval requirement | Require agent confirmation before closing high-risk tickets. | Team Lead | Pending |
| DEC-09 | High-risk definition | Include security incidents, service outages, sensitive data, and legal risk. | Team Lead | Pending |
| DEC-10 | Grounding requirement | Every grounded answer must include at least one approved citation. | AI Lead | Pending |
| DEC-11 | Retention period | Define retention period for tickets and audit records. | Team Lead | Pending |
| DEC-12 | Multilingual support | Exclude multilingual support from Version 1 unless approved. | Product Owner | Pending |

---

## Decision Status

The following status values are permitted:

| Status | Meaning |
|--------|---------|
| Pending | Awaiting review or approval. |
| Approved | Accepted and becomes part of the official specification. |
| Rejected | Proposal has been declined. |
| Deferred | Decision postponed to a future project phase. |

---

## Approval Rules

A decision becomes official only when:

- its status is **Approved**
- the designated owner has confirmed the decision
- all affected documentation has been updated
- evaluation cases are updated if system behavior changes

Pending decisions must not be implemented as production policy.

---

## Change Management

When a decision is approved:

1. Update the relevant documentation.
2. Update evaluation datasets if required.
3. Update deterministic rules if applicable.
4. Record the approval date.
5. Notify the project team of the change.

---

## Related Documents

This document should remain consistent with:

- `taxonomy.md`
- `tool-rules.md`
- `source-register.md`
- `acceptance-criteria.md`
- `clarifying-questions.md`
- `evaluation-plan.md`

Any approved decision that affects these documents should be reflected during the next documentation update.
