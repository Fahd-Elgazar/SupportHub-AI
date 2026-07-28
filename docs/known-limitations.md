# Known Limitations

## Purpose

This document records the known limitations of SupportHub AI Version 1.

These limitations are intentional project constraints, unresolved questions, or future enhancements. They are documented to ensure transparent expectations and to support future development planning.

---

# Knowledge Limitations

## Approved Sources Only

SupportHub AI answers questions only using approved knowledge documents.

Questions outside the approved knowledge base return `not_found` or require manual review.

---

## Limited Knowledge Corpus

Version 1 assumes the approved knowledge corpus consists of:

- Product FAQ
- Troubleshooting Guide
- Support Policy

Additional knowledge sources require project team approval before use.

---

## Citation Scope

The current implementation identifies the approved source document.

More granular citations (section, paragraph, or chunk level) may be added in future versions.

---

# AI Limitations

The AI proposes information but is not the authoritative decision maker.

The AI may propose:

- answer
- suggested reply
- ticket category
- impact
- urgency

The AI must not determine:

- priority
- SLA
- escalation team
- ticket status

These values are controlled by deterministic application logic.

---

# Deterministic Rule Limitations

Priority and routing behavior are based only on the documented policy version.

Future policy updates may change:

- priority matrix
- SLA policies
- routing rules
- escalation conditions

Policy changes require documentation updates and regression testing.

---

# Workflow Limitations

Current assumptions include:

- agent confirmation is required before ticket closure
- high-risk tickets cannot be automatically closed
- unsupported requests require manual review

Final workflow behavior remains subject to team approval.

---

# Security Limitations

SupportHub AI does not:

- access private customer systems
- retrieve confidential internal information
- execute arbitrary user instructions
- reveal system prompts or implementation details

Prompt injection attempts are treated as untrusted input.

---

# Feedback Limitations

User feedback is collected for review purposes only.

Feedback does not automatically:

- modify approved knowledge
- retrain the AI
- update deterministic business rules
- change the ticket taxonomy

Human review is required before any project artifact is updated.

---

# Evaluation Limitations

Evaluation results depend on the available test cases.

The evaluation suite cannot guarantee coverage of every possible customer request or future product change.

Evaluation datasets should be expanded as new edge cases and business requirements are identified.

---

# Future Improvements

Potential future enhancements include:

- additional approved knowledge sources
- multilingual support
- confidence calibration
- section-level citations
- richer provenance metadata
- expanded deterministic routing policies
- larger evaluation datasets
- automated regression testing

These improvements are outside the scope of Version 1.

---

# Review Policy

This document should be reviewed whenever:

- new project capabilities are introduced
- deterministic rules change
- approved knowledge sources change
- evaluation results reveal new limitations

Resolved limitations should be removed from this document and reflected in the relevant project documentation.
