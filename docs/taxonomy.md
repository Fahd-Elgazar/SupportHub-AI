# SupportHub AI Taxonomy

## Purpose

This document defines the exact values currently accepted and returned by the SupportHub AI backend. Values are case-sensitive because the response schema validates them exactly.

## Ticket categories

| Value | Meaning |
|---|---|
| `account_access` | Login, password, account, or authentication issues |
| `technical_issue` | Technical, server, database, or system issues, and reported bugs |
| `billing` | Billing, invoice, payment, or subscription issues |
| `product_question` | Product or feature questions and requests |
| `security` | Security or compromise reports |
| `service_outage` | Service-wide outage reports |
| `other` | Requests that do not match another category |

## Impact

Allowed values:

- `low`
- `medium`
- `high`

## Urgency

Allowed values:

- `low`
- `medium`
- `high`

## Priority

Allowed values:

- `P1`
- `P2`
- `P3`
- `P4`

Priority is calculated deterministically from impact and urgency.

## Status

Allowed response values:

- `Open`
- `In Progress`
- `Resolved`
- `Closed`

The current AI prompt instructs the model to return `Open`. The response schema accepts all four values.

## Normalization behavior

The service normalizes model output before validation:

- `account`, `login`, or `password` terms become `account_access`
- `technical` or `bug` terms become `technical_issue`
- `billing` or `payment` terms become `billing`
- `product` or `feature` terms become `product_question`
- `security` or `hack` terms become `security`
- `outage` terms become `service_outage`
- unmatched values become `other`

Impact and urgency are normalized to `high`, `medium`, or `low`. Unrecognized values fall back to `low`.

## Governance

Any change to these values must be applied consistently to:

- `config/prompts.js`
- `services/supportHub.service.js`
- `schemas/supportResponse.schema.js`
- deterministic evaluation cases
- API evaluation cases
- this taxonomy document
