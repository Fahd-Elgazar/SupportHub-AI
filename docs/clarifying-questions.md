# Clarifying Questions and Working Assumptions

## Purpose

This document records project decisions that remain unresolved and the temporary assumptions used until the project team provides official guidance.

Assumptions in this document are intended to support documentation and discussion only. They must not override approved policies, deterministic rules, or future team decisions.

---

# Open Questions

## 1. Knowledge Base Governance

These questions determine how the knowledge base is managed.

1. Who is authorized to approve, update, and retire knowledge documents?
2. Are the FAQ, Troubleshooting Guide, and Support Policy the complete approved knowledge base for Version 1?
3. Which document formats are officially supported?
4. Should citations reference only the document or also the section/chunk?
5. How should conflicting approved sources be resolved?
6. Does the Support Policy always have higher authority than the FAQ and Troubleshooting Guide?
7. How often should approved knowledge sources be reviewed?

---

## 2. Ticket Classification

These questions affect taxonomy validation.

1. What are the final approved ticket categories?
2. What are the final approved impact levels?
3. What are the final approved urgency levels?
4. Is priority officially represented as P1–P4?
5. Are impact and urgency:
   - provided by the user,
   - proposed by the AI,
   - confirmed by an agent,
   - or determined another way?
6. What should happen if the AI cannot confidently classify a ticket?

---

## 3. Business Rules

These questions affect deterministic processing.

1. Does the SLA represent:
   - first-response time,
   - resolution time,
   - or both?
2. Are SLAs calculated using business hours or calendar hours?
3. Which timezone and holiday calendar should be used?
4. Which situations override the normal priority matrix?
5. Which situations require immediate escalation?

---

## 4. Workflow

These questions define the ticket lifecycle.

1. What ticket statuses are officially supported?
2. Who is authorized to confirm ticket resolution?
3. Who is authorized to close tickets?
4. Is human approval required before sending every suggested reply?
5. How long should ticket records and audit logs be retained?

---

# Working Assumptions

Until the project team confirms otherwise, SupportHub AI assumes:

- Only approved knowledge documents may be searched.
- The Support Policy has higher authority than the FAQ and Troubleshooting Guide.
- Every grounded answer includes at least one approved source.
- Unsupported questions return `not_found` and require manual review.
- The AI may propose:
  - answer,
  - suggested reply,
  - ticket category,
  - impact,
  - urgency.
- Deterministic application logic calculates:
  - priority,
  - SLA,
  - escalation,
  - ticket status permissions.
- Security and high-risk tickets cannot be automatically closed.
- Ticket resolution requires agent confirmation.
- SupportHub AI does not access private customer systems.

---

# Decision Tracking

When a question is resolved:

1. Update the relevant documentation.
2. Remove the question from this document.
3. Record the decision in `team-decisions.md`.
4. Update evaluation tests if the decision changes system behavior.

This document should only contain unresolved questions and temporary assumptions.
