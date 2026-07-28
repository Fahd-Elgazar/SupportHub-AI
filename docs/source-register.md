# Approved Source Register

## Purpose

This document defines the authoritative knowledge sources that SupportHub AI is permitted to use when generating answers. It establishes ownership, version control, approval status, and source precedence to ensure that every AI response is grounded in approved documentation.

Only documents listed in this register with an approved status may be retrieved by the knowledge system.

---

## Approved Sources

| Source ID | Document | Owner | Version | Status | Authority | Review Date |
|-----------|----------|-------|---------|---------|-----------|-------------|
| KB-FAQ-001 | product-faq.md | Knowledge Owner | 1.0 | Approved | Standard | TBD |
| KB-TS-001 | troubleshooting-guide.md | Knowledge Owner | 1.0 | Approved | Standard | TBD |
| KB-POL-001 | support-policy.md | Product Owner | 1.0 | Approved | Highest | TBD |

---

## Source Status Definitions

| Status | Description |
|---------|-------------|
| Draft | Work in progress. Not available to the AI. |
| Under Review | Awaiting approval. Not available to the AI. |
| Approved | Verified and allowed for retrieval. |
| Published | Approved and released for production use. |
| Superseded | Replaced by a newer version. Must not be used for new answers. |
| Retired | No longer valid. Must never be retrieved. |

---

## Authority Order

When two approved sources contain conflicting information, the system should resolve conflicts using the following precedence:

1. Support Policy
2. Troubleshooting Guide
3. Product FAQ

If conflicting information exists within the same authority level, the newest approved version should be used.

If no deterministic resolution is possible, the request must be marked for manual review.

---

## Governance Rules

1. Only documents with status **Approved** or **Published** may be retrieved.
2. Every source must have a unique Source ID.
3. Every approved source must have an assigned owner.
4. Every approved source must maintain a version number.
5. Every approved source must include a scheduled review date.
6. Retired or superseded documents must never appear in new AI responses.
7. Changes to approved sources must create a new version rather than modifying the existing version without record.
8. Every AI-generated answer must reference at least one approved source.
9. Source citations should include both the Source ID and the document name whenever possible.
10. Source approval and retirement decisions require authorization from the designated document owner.

---

## Versioning Policy

- Minor version updates (e.g., 1.0 → 1.1) represent documentation corrections or clarifications.
- Major version updates (e.g., 1.x → 2.0) represent significant policy or product changes.
- Superseded versions should remain archived for audit purposes but must not be retrieved by the production system.

---

## Review Policy

Knowledge owners are responsible for periodically reviewing their documents to ensure accuracy and relevance.

The review schedule and approval workflow are subject to confirmation by the project team.
