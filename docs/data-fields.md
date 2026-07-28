# Shared Data Fields

## Purpose

This document defines the common data model used throughout SupportHub AI.

These fields represent the shared contract between the AI module, backend services, deterministic business logic, evaluation framework, and future frontend components.

Every module should use the same field names, data types, and validation rules to ensure consistency across the system.

---

# Shared Schema

| Field | Type | Required | Owner | Description |
|--------|------|:--------:|--------|-------------|
| question | String | ✅ | User | Customer support question. |
| answer | String \| null | No | AI | Grounded answer generated from approved knowledge. |
| source | String \| null | No | AI | Approved Source ID used to generate the answer. |
| ticket_category | Enum | Yes | AI (validated by Backend) | Category defined in `taxonomy.md`. |
| impact | Enum | Yes | AI (validated by Backend) | Impact level from the approved taxonomy. |
| urgency | Enum | Yes | AI (validated by Backend) | Urgency level from the approved taxonomy. |
| priority | Enum | Yes | Backend | Deterministically calculated priority. |
| sla | String \| null | No | Backend | SLA policy or response target. |
| escalation_team | String \| null | No | Backend | Team determined by routing rules. |
| suggested_reply | String \| null | No | AI | Draft response for support agents. |
| status | Enum | Yes | Backend | Ticket lifecycle status from `taxonomy.md`. |

---

# Optional Provenance Fields

The following fields are recommended for production systems.

| Field | Description |
|--------|-------------|
| ticket_id | Unique ticket identifier. |
| request_id | Unique request identifier. |
| model_version | AI model used for generation. |
| prompt_version | Prompt version used during generation. |
| knowledge_version | Version of the knowledge base. |
| policy_version | Version of deterministic business rules. |
| created_at | Ticket creation timestamp. |
| updated_at | Last modification timestamp. |
| requires_human_review | Indicates whether manual review is required. |

---

# Validation Rules

The backend application must validate all shared fields before processing.

Validation requirements:

1. Required fields must not be empty.
2. Enum values must exactly match the approved taxonomy.
3. Source must reference an approved Source ID from `source-register.md`.
4. Unknown field values must not be silently accepted.
5. AI-generated values must be validated before use.
6. Priority must be calculated by deterministic logic.
7. Status transitions must follow the approved lifecycle.

---

# Data Ownership

| Component | Responsibilities |
|------------|------------------|
| User | Provides the original support request. |
| AI | Generates answers, proposes ticket category, impact, urgency, and suggested reply. |
| Backend | Validates data, calculates priority and SLA, determines routing, controls ticket status, and stores records. |
| Knowledge Base | Provides approved sources used for grounded answers. |

---

# Consistency Requirements

To maintain consistency across the project:

- Field names must remain unchanged.
- Enum values must match `taxonomy.md`.
- Source references must match `source-register.md`.
- Routing values must match `tool-rules.md`.
- Changes to shared fields should be reviewed by the project team before implementation.
