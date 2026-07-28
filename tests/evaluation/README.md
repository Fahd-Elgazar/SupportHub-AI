# SupportHub AI Evaluation Suite

## Files

### supporthub-ai-cases.json

Tests:

- grounded support questions
- unsupported questions
- malformed input
- prompt injection
- source behavior
- expected ticket classification

### deterministic-tool-cases.json

Tests:

- priority calculation
- invalid impact and urgency
- routing rules
- security overrides
- service outage overrides
- manual-review fallback
- high-risk status restrictions

## Important

These files define expected behavior. They do not prove that the application passes the tests.

No pass claim should be made until:

1. An implementation exists.
2. A test runner executes these cases.
3. Exact commands and results are recorded.
4. Failed cases are reviewed.
5. The team lead approves unresolved exceptions.

## Evidence Template

```text
Date:
Branch:
Commit:
Environment:
Command:
Passed:
Failed:
Skipped:
Result file:
Reviewer:
