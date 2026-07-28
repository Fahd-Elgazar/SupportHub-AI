# Known Limitations

## Grounding limitations

The current prompt asks the model to provide `source: ["Internal Knowledge Base"]`, but the backend does not retrieve or verify approved knowledge documents. Source labels therefore do not prove that an answer was grounded in a specific document.

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

Feedback is not stored in a database. The service returns a temporary timestamp-based record only.

## Source traceability

The response contains source strings rather than stable source IDs, document versions, or retrieved passages.
