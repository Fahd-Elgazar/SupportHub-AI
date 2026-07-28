# Shared Data Fields

SupportHub AI uses a common schema across all modules.

| Field | Type | Description |
|------|------|-------------|
| question | String | Customer question |
| answer | String | AI generated answer |
| source | String | Documentation source |
| ticket_category | Enum | Category from taxonomy |
| impact | Enum | low, medium, high |
| urgency | Enum | low, medium, high |
| priority | Enum | P1, P2, P3, P4 |
| sla | String | Response target |
| escalation_team | String | Assigned support team |
| suggested_reply | String | Draft response |
| status | Enum | open, in_progress, escalated, resolved |

## Validation

- Required fields cannot be empty.
- Enums must contain valid values.
- Source must reference an approved document.
