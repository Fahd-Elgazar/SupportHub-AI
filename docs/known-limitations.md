# Known Limitations

## Grounding limitations

The backend loads the three approved knowledge base documents (support policy, product FAQ, troubleshooting guide) directly into the system prompt on every request, and the model is instructed to answer only from that content. This is a real improvement over an earlier version of this document, which described a backend that did not use the knowledge base at all — that statement is no longer accurate.

Within that design, two gaps remain:

- Source labels (e.g. `"Support Policy §4.2"`) identify which approved document the model drew from, but they are not a verifiable retrieval reference — there is no passage-level citation, document ID, or version pinned to the response. The label reflects what the model reports using, not a system-verified trace back to a specific document chunk.
- For questions outside the scope of the knowledge base, the model correctly declines to invent an answer, but has been observed to still return a generic `source: ["Internal KB"]` label even when it states plainly that the knowledge base does not contain the requested information. The refusal behavior is correct; the source metadata accompanying it is not always a reliable signal of whether grounding actually occurred.

## Not-found behavior

The backend does not implement an explicit `not_found` result or a verified refusal path when approved information is unavailable.

## Prompt-injection protection

There is no dedicated prompt-injection detector or deterministic refusal layer. Protection currently depends on the system prompt and the external model.

## AI variability

Answers, classifications, impact, and urgency can vary across providers and runs. The service normalizes classifications, but semantic answer quality remains non-deterministic.

## Provider dependency

The primary support endpoint depends on external Groq or Gemini access and valid API keys. Offline tests require provider mocking.

## Validation fallbacks

Unsupported impact or urgency values fall back to `Low` during normalization. Direct calls to `calculatePriority` with unsupported values return `P4`. These fallbacks can hide upstream classification errors.

## Escalation limitations

The backend has no explicit security flag, service-outage flag, or manual-review flag. P1 is the only global escalation override.

## Status limitations

The backend validates status values but does not implement deterministic status-transition rules.

## Feedback persistence

Feedback is stored in PostgreSQL (`feedback` table, keyed by `ticket_id`). This was previously listed as a limitation; it is implemented as of the backend critical-fixes pass.

## Source traceability

The response contains source strings rather than stable source IDs, document versions, or retrieved passages.
