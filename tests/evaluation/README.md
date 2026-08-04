# SupportHub AI Evaluation

## Purpose

This evaluation suite validates the current backend against its implemented API contracts, taxonomy, deterministic priority/SLA logic, and escalation routing.

## Files

- `supporthub-ai-cases.json`: API and schema cases
- `deterministic-tool-cases.json`: pure-function cases
- `evaluation-evidence.md`: execution record template and current findings

## Important alignment decision

The suite uses the backend's current exact values, confirmed by live execution against `config/taxonomy.js`, `schemas/supportResponse.schema.js`, and a running server (see `evaluation-evidence.md`):

- categories: `account_access`, `technical_issue`, `billing`, `product_question`, `security`, `service_outage`, `other`
- impact and urgency: `low`, `medium`, `high`
- statuses: `Open`, `In Progress`, `Resolved`, `Closed`
- SLA values: `4 Hours`, `8 Hours`, `24 Hours`, `48 Hours`
- feedback request body: `{ ticket_id, rating, comment }`

An earlier version of this suite used a different, Title-case set of these same values. That set matched `tools/escalationTool.js` only — every other part of the backend used the values above the whole time. See `docs/integration-issues.md` for how that was found and corrected.

## Running backend tests

From the backend project directory:

```bash
npm install
npm test
```

The main support endpoint calls external AI providers. A valid API key is required unless the provider is mocked.

## Result matching

### Deterministic cases

The actual function return value must exactly equal `expected.result`.

### API cases

Check:

- HTTP status code
- required wrapper fields
- required response fields
- exact fixed values where specified
- membership in allowed taxonomy values

Do not require exact AI answer wording because provider output is non-deterministic.

## Prompt-injection evaluation

The current backend can be checked for valid JSON/schema output after an injection attempt. It cannot currently be marked as providing deterministic injection refusal or verified grounded answers.

## Pass criteria

- All deterministic cases pass exactly.
- Request validation cases return the documented HTTP status and shape.
- Successful responses satisfy the schema and taxonomy.
- Any provider-dependent test that cannot run is marked `BLOCKED`, not `PASS`.

## Evidence fields

Record:

- test ID
- date/time
- expected result
- actual result
- status: PASS, FAIL, or BLOCKED
- evidence or error message
- tester
