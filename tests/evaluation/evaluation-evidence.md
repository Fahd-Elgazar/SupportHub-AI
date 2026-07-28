# Evaluation Evidence

## Review status

The backend was statically compared with its schemas, tools, routes, controllers, and existing Jest tests.

| Area | Status | Evidence summary |
|---|---|---|
| Request contract | PASS by inspection | `question` is required, trimmed, 5–2000 characters |
| Response taxonomy | PASS by inspection | Joi schema enforces exact category, impact, urgency, priority, and status values |
| Priority matrix | PASS by inspection | All nine combinations are implemented |
| SLA mapping | PASS by inspection | P1/P2/P3/P4 map to 4/8/24/48 Hours |
| Escalation routing | PASS by inspection | P1 override and category routing are implemented |
| Status transitions | NOT IMPLEMENTED | Status values are validated, but no transition tool exists |
| Grounding verification | NOT IMPLEMENTED | No document retrieval or source-ID verification exists |
| Not-found behavior | NOT IMPLEMENTED | No deterministic not-found result exists |
| Prompt-injection refusal | NOT IMPLEMENTED | No dedicated detector or refusal contract exists |
| Full live AI test | BLOCKED until configured | Requires Groq or Gemini credentials and network access |

## Execution record template

| Test ID | Expected | Actual | Status | Evidence / Notes | Tester | Timestamp |
|---|---|---|---|---|---|---|
| TOOL-001 | P1 |  |  |  |  |  |
| API-002 | HTTP 400 |  |  |  |  |  |

## QA rule

Implementation/documentation differences should be recorded before any contract change. In this aligned package, the documentation and evaluation cases have been updated to describe the current backend rather than unimplemented behavior.
