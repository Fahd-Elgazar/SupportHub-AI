# SupportHub AI Taxonomy

## Purpose

This document defines the exact values currently accepted and returned by the SupportHub AI backend. Values are case-sensitive because the response schema validates them exactly.

## Ticket categories

| Value | Meaning |
|---|---|
| `Technical` | Technical, server, database, or system issues |
| `Billing` | Billing, invoice, payment, or subscription issues |
| `Account` | Login, password, account, or authentication issues |
| `General` | Requests that do not match another category |
| `Bug` | Reported software defects |
| `Feature Request` | Requests for new or changed functionality |

## Impact

Allowed values:

- `Low`
- `Medium`
- `High`

## Urgency

Allowed values:

- `Low`
- `Medium`
- `High`

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
- `Pending`
- `Escalated`
- `Resolved`

The current AI prompt instructs the model to return `Open`. The response schema accepts all four values.

## Normalization behavior

The service normalizes model output before validation:

- login, password, account, or authentication terms become `Account`
- billing, invoice, or payment terms become `Billing`
- bug terms become `Bug`
- feature terms become `Feature Request`
- technical, server, database, or system terms become `Technical`
- unmatched values become `General`

Impact and urgency are normalized to `High`, `Medium`, or `Low`. Unrecognized values fall back to `Low`.

## Governance

Any change to these values must be applied consistently to:

- `config/prompts.js`
- `services/supportHub.service.js`
- `schemas/supportResponse.schema.js`
- deterministic evaluation cases
- API evaluation cases
- this taxonomy document
