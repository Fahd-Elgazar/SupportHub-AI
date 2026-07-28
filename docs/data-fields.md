# SupportHub AI Data Fields

## Support request

| Field | Type | Required | Validation |
|---|---|---:|---|
| `question` | string | Yes | Trimmed; minimum 5 characters; maximum 2000 characters |

Unknown request fields are removed by validation.

## Support response data

The main endpoint returns a wrapper with `success` and `data`.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `question` | string | Yes | Original validated question |
| `answer` | string | Yes | AI-generated answer or fallback text |
| `source` | array of strings | Yes | Source labels returned by the model or fallback source |
| `ticket_category` | string | Yes | Must follow the approved backend taxonomy |
| `impact` | string | Yes | `Low`, `Medium`, or `High` |
| `urgency` | string | Yes | `Low`, `Medium`, or `High` |
| `priority` | string | Yes | `P1`, `P2`, `P3`, or `P4` |
| `sla` | string | Yes | `4 Hours`, `8 Hours`, `24 Hours`, or `48 Hours` |
| `escalation_team` | string | Yes | Determined from priority and category |
| `suggested_reply` | string | Yes | AI-generated reply or fallback text |
| `status` | string | Yes | `Open`, `Pending`, `Escalated`, or `Resolved` |

## Feedback request

| Field | Type | Required | Validation |
|---|---|---:|---|
| `question` | string | Yes | Non-empty trimmed string |
| `answer` | string | Yes | Non-empty trimmed string |
| `rating` | integer | Yes | From 1 to 5 |
| `comment` | string | No | Empty allowed; maximum 1000 characters |

## Feedback response data

| Field | Type | Notes |
|---|---|---|
| `id` | string | Timestamp-based temporary identifier |
| `question` | string | Submitted question |
| `answer` | string | Submitted answer |
| `rating` | integer | Submitted rating |
| `comment` | string | Empty string when omitted |
| `createdAt` | ISO date-time string | Creation timestamp |
