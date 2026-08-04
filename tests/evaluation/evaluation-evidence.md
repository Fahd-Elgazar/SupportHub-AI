# Evaluation Evidence

## Review status

The backend was live-executed against a real PostgreSQL instance and a real Groq provider call, not just statically inspected. All 24 deterministic cases and all 12 API cases in this directory were run and passed after the backend critical-fixes pass (`fix/backend-critical`, commit `b950e05`).

| Area | Status | Evidence summary |
|---|---|---|
| Request contract | PASS — executed | API-002 through API-005 executed; `question` validation confirmed live |
| Response taxonomy | PASS — executed | API-001 executed against a live Groq call; `ticket_category`/`impact`/`urgency`/`status` all matched `config/taxonomy.js` |
| Priority matrix | PASS — executed | All 9 combinations executed directly against `calculatePriority` (TOOL-001–009); 2 combinations additionally confirmed end-to-end through a live `POST /api/supporthub-ai` call (`high`/`high` → `P1`, `medium`/`medium` → `P3`) |
| SLA mapping | PASS — executed | TOOL-012–016 executed directly against `calculateSLA` |
| Escalation routing | PASS — executed | All 8 routing cases (TOOL-017–024) executed directly against `getEscalationTeam`; 2 additionally confirmed end-to-end (`billing`/P3 → Billing Team, `service_outage`/P1 → Critical Incident Team) |
| No duplicate ticket rows | PASS — executed | Ticket count in `GET /tickets` matched the number of `POST /api/supporthub-ai` calls made during this evaluation exactly (4 calls → 4 rows) |
| Feedback persistence | PASS — executed | API-006 executed; row confirmed present via `GET /api/supporthub-ai/feedback` |
| Status transitions | NOT IMPLEMENTED | Status values are validated, but no transition tool exists |
| Grounding verification | NOT IMPLEMENTED | No document retrieval or source-ID verification exists |
| Not-found behavior | NOT IMPLEMENTED | No deterministic not-found result exists |
| Prompt-injection refusal | NOT IMPLEMENTED | No dedicated detector or refusal contract exists; AI-SEC-001 only confirms the response shape stays valid |

## Execution record

Executed 2026-08-04 against `fix/backend-critical` (commit `b950e05`), a disposable local PostgreSQL 16 container, and a live Groq API call.

| Test ID | Expected | Actual | Status | Evidence / Notes | Tester | Timestamp |
|---|---|---|---|---|---|---|
| TOOL-001–024 | See `deterministic-tool-cases.json` | Matched for all 24 | PASS | Ran directly via `node -e` against `tools/priorityTool.js` and `tools/escalationTool.js` | Integration review | 2026-08-04 |
| API-001 | HTTP 200, valid taxonomy | HTTP 200, `ticket_category` within allowed set | PASS | Live Groq call | Integration review | 2026-08-04 |
| API-002 | HTTP 400 | HTTP 400, `errors: ["Question is required."]` | PASS | | Integration review | 2026-08-04 |
| API-003 | HTTP 400 | HTTP 400, `errors: ["Question cannot be empty."]` | PASS | | Integration review | 2026-08-04 |
| API-004 | HTTP 400 | HTTP 400, `errors: ["Question must contain at least 5 characters."]` | PASS | | Integration review | 2026-08-04 |
| API-005 | HTTP 400 | HTTP 400, `errors: ["Question is required."]` | PASS (for the wrong reason) | Fixture bug — see `docs/integration-issues.md` #10 | Integration review | 2026-08-04 |
| API-006 | HTTP 201 | HTTP 201, row present in `feedback` table | PASS | | Integration review | 2026-08-04 |
| API-007 | HTTP 400 | HTTP 400, Joi rating-range message | PASS | | Integration review | 2026-08-04 |
| API-008 | HTTP 200 | HTTP 200, `status: "healthy"` | PASS | | Integration review | 2026-08-04 |
| API-009 | HTTP 200 | HTTP 200, `provider: "groq"` | PASS | | Integration review | 2026-08-04 |
| API-010 | HTTP 200 | HTTP 200 | PASS | Confirmed this route is `GET`, not `POST` as previously documented | Integration review | 2026-08-04 |
| API-011 | HTTP 404 | HTTP 404 | PASS | | Integration review | 2026-08-04 |
| AI-SEC-001 | HTTP 200, valid schema | HTTP 200, valid schema | PASS | Shape-only check, per its own note | Integration review | 2026-08-04 |

## QA rule

Implementation/documentation differences should be recorded before any contract change. This package's documentation and evaluation cases describe the current backend as verified by live execution, not by inspection or by an earlier (incorrect) alignment pass.
