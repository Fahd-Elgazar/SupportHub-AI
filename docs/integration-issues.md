# Integration Issues and Alignment Record

## Purpose

This report records differences found while comparing knowledge-quality documentation and evaluation design with the actual backend implementation, and tracks what changed as a result.

## Correction to the previous alignment pass

The alignment recorded earlier in this document (categories `Technical`/`Billing`/`Account`/`General`/`Bug`/`Feature Request`, Title-case impact/urgency, status set `Open`/`Pending`/`Escalated`/`Resolved`) was itself incorrect. It matched `tools/escalationTool.js`, which — as the integration review that led to this update found — had drifted from every other part of the backend. `config/taxonomy.js`, `config/prompts.js`, `schemas/supportResponse.schema.js`, and `services/supportHub.service.js` all agreed on a different, snake_case taxonomy the whole time. Docs and evaluation cases have now been corrected to that taxonomy — see `docs/taxonomy.md` — and `escalationTool.js` itself has been fixed to match it rather than the other way around.

| Area | Value now confirmed correct (matches `config/taxonomy.js` and schema) |
|---|---|
| Categories | `account_access`, `technical_issue`, `billing`, `product_question`, `security`, `service_outage`, `other` |
| Impact/urgency | `low`, `medium`, `high` |
| Status | `Open`, `In Progress`, `Resolved`, `Closed` |
| SLA | `4 Hours`, `8 Hours`, `24 Hours`, `48 Hours` |
| Feedback request body | `{ ticket_id, rating, comment }` — not `{ question, answer, rating, comment }` |

## Backend defects found and fixed

These were found by tracing the taxonomy mismatch through the code and were fixed on the backend branch, not just documented around:

1. **Duplicate ticket insertion.** `askSupport` inserted every ticket into PostgreSQL twice (once inside the service, once again in the controller on the already-saved row). Fixed — the controller now uses the value the service returns.
2. **Priority always P4.** `tools/priorityTool.js`'s matrix used capitalized keys (`High`/`Medium`/`Low`) but always received lowercase values, so every ticket silently fell through to the `P4` default regardless of actual impact/urgency. Fixed — matrix keys are now lowercase, matching `config/taxonomy.js`.
3. **Escalation always "Support Team".** `tools/escalationTool.js` switched on category values (`Technical`, `Account`, `Bug`, `Feature Request`) that don't exist in the canonical taxonomy, so routing always fell to the default. Fixed — it now switches on the real category values.
4. **No CORS.** The API had no CORS middleware, so browser requests from the frontend's own origin would be rejected outright. Fixed — scoped to a `CORS_ORIGIN` env var.
5. **Feedback persistence.** Previously undocumented/assumed missing; confirmed implemented (PostgreSQL `feedback` table).
6. **Repo hygiene.** `node_modules` was committed to the backend branch; no `.env.example` or README existed. Both fixed.

Priority and escalation routing were live-verified against the fixed backend with a real database and a real AI provider call, not just re-derived from reading the code: a `high`/`high` outage question correctly returned `P1` / `Critical Incident Team`, and a `medium`/`medium` billing question correctly returned `P3` / `Billing Team`.

## Remaining implementation gaps

These items cannot be solved by documentation alignment because the backend does not implement them:

1. Verified retrieval from the bounded knowledge set.
2. Stable source IDs and source-passage traceability.
3. Deterministic not-found behavior.
4. Dedicated prompt-injection refusal behavior.
5. Security and service-outage override flags (both categories exist in the taxonomy but have no dedicated escalation routing — see `docs/tool-rules.md`).
6. Manual-review field and routing contract.
7. Deterministic status-transition tool.
8. Provider mocking for reliable offline AI endpoint tests.

Also outstanding, found during this alignment pass and not yet resolved:

9. `docs/module-scope.md` and `docs/team-decisions.md` still describe the older, richer taxonomy/escalation model (security/outage flags, manual review, an 8-value status lifecycle) as current or pending. They were not in scope for this update and still need to be reconciled with `docs/taxonomy.md` and `docs/tool-rules.md`.
10. `tests/evaluation/supporthub-ai-cases.json` case `API-005` sends its oversized-question fixture under the key `question_fixture` instead of `question`, so the request the test actually sends is `{}`, not an over-length question — it currently passes for the wrong reason. Not fixed here since it predates and is unrelated to the backend taxonomy fix; flagged for QA to correct separately.

## Recommendation

Treat the taxonomy and contracts in this document, `docs/taxonomy.md`, `docs/data-contracts.md`, and `docs/data-fields.md` as the verified-accurate description of the current backend — verified against running code, not just static reading. Track the remaining gaps above as future work.
