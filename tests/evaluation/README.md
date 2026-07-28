# SupportHub AI Evaluation Suite

## Purpose

This directory contains evaluation cases used to verify the expected behavior of SupportHub AI.

The evaluation suite covers:

- grounded knowledge responses
- ticket classification
- deterministic business rules
- validation behavior
- escalation routing
- safety and prompt-injection resistance
- ticket status restrictions

These files define expected behavior only. They do not prove that the application currently satisfies the requirements.

---

## Evaluation Files

### `supporthub-ai-cases.json`

Contains evaluation cases for AI-assisted SupportHub behavior.

The cases test:

- grounded support questions
- supported product questions
- troubleshooting responses
- unsupported questions
- missing approved knowledge
- malformed input
- prompt injection
- source traceability
- fabricated-source prevention
- expected ticket category
- expected impact
- expected urgency
- manual-review behavior
- security-related classification
- service-outage classification

This file evaluates outputs proposed by the AI module.

AI-generated classifications must still be validated by the application before they are used in deterministic processing.

---

### `deterministic-tool-cases.json`

Contains evaluation cases for deterministic application functions.

The cases test:

- all approved impact and urgency combinations
- priority calculation
- SLA lookup behavior
- invalid impact values
- invalid urgency values
- missing required values
- supported policy versions
- unsupported policy versions
- escalation routing
- security-routing overrides
- service-outage routing overrides
- category-based routing
- manual-review fallback
- valid status transitions
- invalid status transitions
- high-risk status restrictions
- agent-confirmation requirements

These cases must produce repeatable results for identical validated inputs.

---

## Expected File Structure

Evaluation files should use a versioned top-level structure.

Example:

```json
{
  "schema_version": "1.0",
  "description": "Description of the evaluation suite.",
  "tests": [
    {
      "id": "CASE-001",
      "input": {},
      "expected": {}
    }
  ]
}
```

Each test case should contain:

| Field | Description |
|---|---|
| `id` | Unique and stable test identifier |
| `function` | Function being tested, when applicable |
| `input` | Input supplied to the system |
| `expected` | Expected result or behavior |
| `notes` | Optional explanation or review guidance |

Test IDs must not be reused for different scenarios.

---

## Evaluation Principles

### Grounded Responses

A grounded response passes only when:

- the answer is supported by an approved knowledge source
- the cited source exists
- the cited source supports the answer
- no unsupported details are introduced
- source authority rules are respected

A fluent but unsupported answer must fail.

---

### Classification

Classification evaluation should verify:

- category
- impact
- urgency
- security indicators
- service-outage indicators
- manual-review requirements

Priority must not be evaluated as an AI-generated value.

Priority must be calculated by the deterministic application function after impact and urgency have been validated.

---

### Deterministic Functions

A deterministic test passes only when the actual output matches the expected output for the supplied input.

The same input, policy version, and rule version must produce the same result across repeated executions.

Deterministic functions include:

- priority calculation
- SLA lookup
- escalation routing
- status-transition validation

---

### Safety

The application must reject or safely handle:

- prompt-injection attempts
- instructions to ignore approved sources
- requests to fabricate citations
- requests to bypass validation
- unsupported security guidance
- malformed or incomplete input

Unsafe or unsupported cases should result in rejection, validation failure, or manual review according to the documented rules.

---

## Result Matching

Expected outputs should use one exact result whenever the policy defines one deterministic outcome.

For example:

```json
{
  "result": "validation_error"
}
```

Avoid ambiguous values such as:

```json
{
  "result": "validation_error_or_manual_review"
}
```

unless the application contract explicitly permits both outcomes.

Before formal execution, ambiguous expected results should be resolved through an approved team decision.

Additional output fields may be ignored only when the test runner explicitly supports partial matching.

The test runner must document whether it uses:

- exact object matching
- required-field matching
- schema validation
- semantic evaluation
- human review

---

## Execution Requirements

No pass claim should be made until:

1. An implementation exists.
2. The implementation version is identified.
3. A test runner executes the evaluation cases.
4. The execution command is recorded.
5. The execution environment is recorded.
6. Actual outputs are preserved.
7. Passed, failed, and skipped cases are counted.
8. Failed cases are reviewed.
9. Any approved exceptions are documented.
10. The designated reviewer approves the result.

---

## Pass Criteria

The suite may be reported as passed only when:

- every required test has been executed
- all required tests pass
- no unresolved security test fails
- no unsupported answer is accepted as grounded
- deterministic outputs match the approved rules
- all skipped cases have documented justification
- the evidence record is complete
- the reviewer approves the result

A partial pass must not be reported as a complete pass.

---

## Failure Handling

When a case fails:

1. Record the test ID.
2. Preserve the actual output.
3. Compare the result with the relevant contract or policy.
4. Determine whether the issue is in:
   - the implementation
   - the evaluation case
   - the documentation
   - the approved business rule
5. Correct the appropriate artifact.
6. Repeat the affected test.
7. Record the new result.

Expected outputs must not be changed only to make a failing implementation pass.

Any policy or contract change must follow the approved change-management process.

---

## Skipped Cases

A test may be skipped only when:

- the required feature has not been implemented
- an external dependency is unavailable
- the test is blocked by an approved pending decision
- the test environment cannot support the scenario

Every skipped case must include:

- test ID
- reason
- owner
- approval
- planned resolution

Skipped tests do not count as passed tests.

---

## Evidence Template

```text
Evaluation Suite:
Schema Version:
Application Version:

Date:
Time:
Branch:
Commit:
Environment:
Operating System:
Runtime Version:
Model Version:
Knowledge Version:
Policy Version:

Test Runner:
Command:
Configuration:

Total Cases:
Executed:
Passed:
Failed:
Skipped:

Failed Test IDs:
Skipped Test IDs:

Result File:
Log File:
Evidence Location:

Known Exceptions:
Reviewer:
Review Date:
Approval Status:
```

---

## Example Evidence Record

```text
Evaluation Suite: SupportHub AI Evaluation Suite
Schema Version: 1.0
Application Version: 0.1.0

Date: YYYY-MM-DD
Time: HH:MM
Branch: feature/supporthub-ai
Commit: COMMIT_HASH
Environment: local
Operating System: Windows 11
Runtime Version: Python X.Y
Model Version: MODEL_IDENTIFIER
Knowledge Version: 1.0
Policy Version: 1.0

Test Runner: pytest
Command: pytest tests/evaluation -v
Configuration: default

Total Cases: 0
Executed: 0
Passed: 0
Failed: 0
Skipped: 0

Failed Test IDs: None
Skipped Test IDs: None

Result File: path/to/results.json
Log File: path/to/test.log
Evidence Location: path/to/evidence

Known Exceptions: None
Reviewer: TEAM_CONFIRMATION_REQUIRED
Review Date: TEAM_CONFIRMATION_REQUIRED
Approval Status: Pending
```

---

## Traceability

Evaluation cases should be traceable to the relevant project documents, including:

- `docs/acceptance-criteria.md`
- `docs/data-contracts.md`
- `docs/edge-cases.md`
- `docs/evaluation-plan.md`
- `docs/taxonomy.md`
- `docs/tool-rules.md`
- `knowledge/supporthub-ai/product-faq.md`
- `knowledge/supporthub-ai/support-policy.md`
- `knowledge/supporthub-ai/troubleshooting-guide.md`

When a documented rule changes, all affected evaluation cases must be reviewed and updated.

---

## Maintenance Policy

The evaluation suite should be reviewed whenever:

- the taxonomy changes
- a data contract changes
- a deterministic rule changes
- a knowledge document changes
- a routing rule changes
- a status-transition rule changes
- a new edge case is identified
- a production failure reveals missing test coverage

Retired cases should remain traceable through version history.

---

## Important Notice

These files describe expected behavior.

They do not demonstrate that SupportHub AI passes the evaluation suite.

No statement of successful evaluation should be made without recorded execution evidence and reviewer approval.
