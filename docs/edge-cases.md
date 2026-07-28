# SupportHub AI Edge Cases

This document lists important edge cases that SupportHub AI must handle safely and consistently.

| ID | Edge Case | Expected Behavior |
|----|-----------|------------------|
| EC-01 | User submits an empty question | Return a validation error asking the user to enter a question. |
| EC-02 | Question is unrelated to the supported product | Inform the user that no approved information is available and recommend manual support. |
| EC-03 | No approved source contains the answer | Return "No approved answer found" and escalate if necessary. |
| EC-04 | Two approved sources provide conflicting information | Flag the conflict and require human review. |
| EC-05 | Impact is missing | Return a validation error; do not calculate priority. |
| EC-06 | Urgency is missing | Return a validation error; do not calculate priority. |
| EC-07 | Ticket category cannot be determined | Assign `other` or `unknown` and send for manual triage. |
| EC-08 | User marks every issue as critical | Ignore the claim and determine priority using the defined rules. |
| EC-09 | Prompt injection attempt (e.g., "Ignore previous instructions") | Ignore malicious instructions and continue following system rules. |
| EC-10 | Security issue disguised as a normal login problem | Escalate to the Security Team for manual review. |

---

## General Rules

- Never fabricate answers.
- Never use unapproved knowledge sources.
- Every answer must include its source.
- High-risk tickets cannot be automatically closed.
- Invalid input must never produce a successful response.
