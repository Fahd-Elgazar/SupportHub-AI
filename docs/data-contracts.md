# Data and Interface Contracts

## Purpose

Defines the interfaces between the AI module, deterministic application logic,
knowledge services, and ticket management components.

These contracts ensure every component exchanges data using
consistent field names, validation rules, and ownership.
## Design Principles

All contracts should:

- use shared field names
- validate inputs before processing
- reject unknown enum values
- preserve auditability
- remain backward compatible where practical
## Contract Version

Version: 1.0

Future breaking changes should create a new contract version and update all dependent documentation.

## 1. Knowledge Search Request

| Field | Type | Required | Owner |
|---|---|---:|---|
| request_id | string | Yes | Application |
| question | string | Yes | User |
| locale | string | No | Application |
| allowed_source_ids | array or null | No | Application |

### Validation Rules

- `question` must not be empty or whitespace-only.
- The question must respect the approved maximum length.
- User text cannot expand the approved source scope.
- Secrets and unnecessary personal information should not be included.

---

## 2. Knowledge Search Response

| Field | Type | Required |
|---|---|---:|
| request_id | string | Yes |
| result_status | enum | Yes |
| answer | string or null | Yes |
| citations | array | Yes |
| requires_human_review | boolean | Yes |
| limitations | array | Yes |

### Allowed Result Status

- `grounded`
- `partial`
- `not_found`
- `conflicting_sources`
- `error`

### Rules

- A grounded answer requires at least one approved citation.
- A not-found response must not contain an invented answer.
- Conflicting sources require deterministic resolution or human review.

---

## 3. AI Triage Proposal

| Field | Type | Required |
|---|---|---:|
| proposed_ticket_category | enum | Yes |
| proposed_impact | enum | Yes |
| proposed_urgency | enum | Yes |
| rationale | string | Yes |
| evidence_spans | array | No |
| uncertainty_flags | array | Yes |

This contract represents an AI proposal only.

The AI must not authoritatively assign:

- priority
- SLA
- escalation team
- final status

---

## 4. Priority and SLA Input

| Field | Type | Required |
|---|---|---:|
| impact | enum | Yes |
| urgency | enum | Yes |
| policy_version | string | Yes |
| calculated_at | datetime | Yes |

## 5. Priority and SLA Result

| Field | Type | Required |
|---|---|---:|
| priority | enum | Yes |
| sla_policy_id | string | Yes |
| first_response_due_at | datetime or null | No |
| resolution_due_at | datetime or null | No |
| calculation_reason_code | string | Yes |
| manual_review_required | boolean | Yes |

### Deterministic Requirements

- The same validated input and policy version must produce the same result.
- Unknown values must not be silently accepted.
- Missing matrix combinations require manual review.
- AI text cannot override the result.

---

## 6. Escalation Input

| Field | Type | Required |
|---|---|---:|
| ticket_category | enum | Yes |
| priority | enum | Yes |
| security_flag | boolean | Yes |
| service_outage_flag | boolean | Yes |
| policy_version | string | Yes |

## 7. Escalation Result

| Field | Type | Required |
|---|---|---:|
| escalation_team | enum | Yes |
| route_reason_code | string | Yes |
| escalation_required | boolean | Yes |
| manual_review_required | boolean | Yes |

### Recommended Precedence

1. Security override
2. Critical outage override
3. Other high-risk override
4. Category and priority routing
5. Manual-review fallback

This order requires team approval.

---

## 8. Final Ticket Record

Required product fields:

- question
- answer
- source
- ticket_category
- impact
- urgency
- priority
- sla
- escalation_team
- suggested_reply
- status

Recommended provenance fields:

- ticket_id
- citations
- knowledge_result_status
- requires_human_review
- knowledge_version
- taxonomy_version
- priority_policy_version
- routing_policy_version
- prompt_version
- model_version
- created_at
- updated_at
- decision_log

---

## 9. Feedback Contract

| Field | Type | Required |
|---|---|---:|
| feedback_id | string | Yes |
| ticket_id | string | Yes |
| actor_type | enum | Yes |
| rating | enum | Yes |
| reason_codes | array | No |
| corrected_answer | string or null | No |
| corrected_category | enum or null | No |
| correction_notes | string or null | No |
| created_at | datetime | Yes |

Feedback must create a review candidate. It must not automatically update approved knowledge.
 # Contract Evolution

Any changes to these interfaces should be reviewed by the project team.

Breaking changes should:

- update shared data fields
- update deterministic tool rules
- update evaluation cases
- update documentation
