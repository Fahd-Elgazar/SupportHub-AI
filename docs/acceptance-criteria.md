# SupportHub AI Acceptance Criteria

## API request validation

A request passes when:

- `question` is present
- `question` is a string
- trimming leaves at least 5 characters
- the question is no longer than 2000 characters

Invalid requests return HTTP 400 with `success: false`, a validation message, and field-level errors.

## Main response contract

A successful support request must:

- return HTTP 200
- return `success: true`
- include every field required by `supportResponse.schema.js`
- use only approved category, impact, urgency, priority, and status values
- contain a non-empty source array
- use an SLA value consistent with priority
- use an escalation team consistent with priority and category

## Deterministic correctness

- Priority must match the 3×3 matrix.
- SLA must match the priority-to-time map.
- Every P1 ticket must route to `Critical Incident Team`.
- Non-P1 tickets must route according to category.

## Feedback

Valid feedback returns HTTP 201. Ratings outside 1–5 are rejected with HTTP 400.

## Operational endpoints

- `/health` returns HTTP 200 and `status: healthy`.
- `/version` returns API and prompt versions.
- `/validate` confirms valid requests without generating an AI response.

## Evaluation caveat

AI answer quality cannot be evaluated deterministically without controlling or mocking the external provider. Contract, taxonomy, and deterministic tool behavior can be evaluated locally.
