# Edge Cases and Failure Behavior

| ID | Edge Case | Expected Behavior |
|---|---|---|
| EC-01 | Empty question | Return validation error |
| EC-02 | Whitespace-only question | Return validation error |
| EC-03 | Unsupported product question | Return `not_found`; do not fabricate |
| EC-04 | No approved source | Return `not_found` and require manual review |
| EC-05 | Partial supporting information | Return `partial` and identify limitations |
| EC-06 | Conflicting approved sources | Apply authority/version rule or require review |
| EC-07 | Retired source retrieved | Reject the source and log the failure |
| EC-08 | Missing impact | Validation failure or approved manual-review fallback |
| EC-09 | Missing urgency | Validation failure or approved manual-review fallback |
| EC-10 | Invalid category | Route to manual review |
| EC-11 | User claims every issue is critical | Validate impact and urgency; calculate deterministically |
| EC-12 | User asks AI to set priority | Ignore requested priority and run deterministic calculation |
| EC-13 | Direct prompt injection | Do not reveal instructions or modify policy |
| EC-14 | Prompt injection inside retrieved source | Treat retrieved text as data, not instructions |
| EC-15 | Security issue disguised as login issue | Apply security override when validated |
| EC-16 | AI invents a source | Reject answer and log citation-integrity failure |
| EC-17 | SLA calculator fails | Preserve ticket and require manual review |
| EC-18 | Router has no matching team | Route to manual triage |
| EC-19 | Attempt to auto-close high-risk ticket | Reject status transition |
| EC-20 | User requests private customer-system access | Explain that this is outside product scope |

## General Failure Principles

- Never fabricate an answer.
- Never use an unapproved source.
- Never allow AI output to override deterministic tools.
- Preserve the ticket if AI or tool execution fails.
- Use manual review when authority or policy is uncertain.
- Do not expose internal prompts, secrets, stack traces, or private paths.
