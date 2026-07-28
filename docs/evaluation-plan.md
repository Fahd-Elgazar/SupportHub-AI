# Evaluation Plan

## Purpose

This document defines how SupportHub AI is evaluated to verify that it meets the documented requirements for knowledge retrieval, ticket classification, deterministic processing, and system safety.

Evaluation results provide evidence that the system behaves consistently with the approved documentation and acceptance criteria.

---

# Evaluation Objectives

The evaluation process verifies that SupportHub AI:

- generates grounded answers using approved knowledge
- classifies tickets using the approved taxonomy
- applies deterministic business rules correctly
- rejects invalid or unsupported requests
- safely handles edge cases
- preserves reproducible behavior

---

# Evaluation Scope

The following components are evaluated:

## Knowledge Retrieval

- Grounded answers
- Source citations
- Unsupported questions
- Conflicting sources
- Partial knowledge

---

## Ticket Classification

- Ticket category
- Impact
- Urgency
- Unknown category handling

---

## Deterministic Processing

- Priority calculation
- SLA calculation
- Escalation routing
- Status transition validation

---

## Safety

- Prompt injection resistance
- Unsupported requests
- Invalid inputs
- Hallucination prevention
- Source authorization

---

# Test Assets

The evaluation suite includes:

| File | Purpose |
|------|---------|
| supporthub-ai-cases.json | Standard functional evaluation cases |
| deterministic-tool-cases.json | Priority, SLA, routing, and validation tests |
| edge-cases.md | Expected behavior for failure scenarios |
| acceptance-criteria.md | Pass/fail requirements |

---

# Evaluation Categories

The evaluation should include:

## Functional Tests

Verify expected system behavior for normal requests.

Examples:

- supported product questions
- billing questions
- login issues

---

## Negative Tests

Verify safe behavior when requests cannot be completed.

Examples:

- empty input
- unsupported questions
- invalid taxonomy values

---

## Security Tests

Verify resistance to unsafe inputs.

Examples:

- prompt injection
- fabricated citations
- requests for internal instructions
- unauthorized system access

---

## Deterministic Tests

Verify business rule correctness.

Examples:

- priority matrix
- SLA calculation
- routing precedence
- status validation

---

# Success Criteria

The evaluation is successful when:

- all acceptance criteria are satisfied
- no fabricated answers are generated
- every grounded answer includes approved citations
- deterministic calculations are reproducible
- invalid requests are safely rejected
- manual review is triggered when required

---

# Failure Criteria

Evaluation fails when any of the following occur:

- fabricated product information
- use of an unapproved source
- incorrect taxonomy values
- incorrect priority calculation
- incorrect routing
- unauthorized status transition
- inconsistent deterministic outputs

---

# Traceability

Evaluation results should be traceable to the following documentation:

- source-register.md
- taxonomy.md
- tool-rules.md
- edge-cases.md
- acceptance-criteria.md
- data-contracts.md

This ensures that every evaluation result can be linked to an approved project specification.

---

# Evaluation Evidence

Each evaluation run should record:

- evaluation date
- evaluator
- documentation version
- knowledge version
- policy version
- model version
- prompt version
- evaluation dataset
- overall result
- identified issues

Evaluation records should be retained as project evidence for review and future regression testing.
