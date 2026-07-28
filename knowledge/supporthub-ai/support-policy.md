# Support Policy

**Document ID:** KB-POL-001

**Version:** 1.0

**Status:** Approved

**Owner:** Support Operations

---

## Purpose

This document defines the approved support policies used by SupportHub AI when generating grounded responses and processing support tickets.

Where conflicts exist between approved knowledge documents, this policy takes precedence over the Product FAQ and Troubleshooting Guide.

---

## Policy Scope

This policy defines:

- grounded answer requirements
- ticket processing principles
- escalation requirements
- source traceability requirements

It does not define detailed troubleshooting procedures or product feature documentation.

---

## Grounded Answers Policy

SupportHub AI must:

- answer only using approved knowledge sources
- avoid generating unsupported information
- return `not_found` or require manual review when no approved information exists

Grounded answers must remain consistent with the approved documentation.

---

## Ticket Processing Policy

SupportHub AI may propose:

- ticket category
- impact
- urgency
- suggested reply

The application is responsible for:

- validating proposed values
- calculating priority
- determining SLA
- routing tickets
- enforcing ticket status rules

---

## Priority Policy

Ticket priority is determined using validated **Impact** and **Urgency** values.

Priority is calculated using the approved deterministic rules and must not be assigned directly by the AI.

---

## Escalation Policy

The following rules apply:

- Security incidents must be routed to the Security Team.
- Unsupported or unknown issues require manual review.
- High-risk tickets must not be automatically closed.
- Routing decisions follow the approved deterministic routing policy.

---

## Source Traceability Policy

Every grounded answer must:

- reference at least one approved source
- use only approved documentation
- avoid fabricated citations

If an approved source cannot be identified, the system should not generate a grounded answer.

---

## Review Policy

This document should be reviewed whenever:

- support policies change
- routing rules change
- deterministic business rules change
- new knowledge sources are approved

Approved changes should be reflected in the supporting documentation and evaluation tests.
