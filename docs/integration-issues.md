# Integration Issues and Alignment Record

## Purpose

This report records differences found while comparing the previous knowledge-quality documentation and evaluation design with the current backend implementation.

## Resolved by documentation/evaluation alignment

| Area | Previous expectation | Current backend | Alignment applied |
|---|---|---|---|
| Categories | lowercase domain labels such as `technical_issue` | Title-case values such as `Technical` and `Account` | Taxonomy and tests updated to backend values |
| Impact/urgency | lowercase | `Low`, `Medium`, `High` | Documentation and tests updated |
| Status | `new`, `in_progress`, `resolved`, `closed` | `Open`, `Pending`, `Escalated`, `Resolved` | Contracts and tests updated |
| SLA | `TEAM_CONFIRMATION_REQUIRED` | `4 Hours`, `8 Hours`, `24 Hours`, `48 Hours` | Tool rules and tests updated |
| Escalation | Security/outage/manual-triage model | Priority/category routing | Tool rules and tests updated |
| Input field | `message` in some evaluation cases | `question` | API cases updated |
| Function names | proposed combined tools | `calculatePriority`, `calculateSLA`, `getEscalationTeam` | Deterministic cases updated |

## Remaining implementation gaps

These items cannot be solved by documentation alignment because the backend does not implement them:

1. Verified retrieval from the bounded knowledge set.
2. Stable source IDs and source-passage traceability.
3. Deterministic not-found behavior.
4. Dedicated prompt-injection refusal behavior.
5. Security and service-outage override flags.
6. Manual-review field and routing contract.
7. Deterministic status-transition tool.
8. Persistent feedback storage.
9. Provider mocking for reliable offline AI endpoint tests.

## Recommendation

Treat the aligned files as the accurate description of the current backend. Track the remaining gaps as future backend enhancements rather than claiming they already exist.
