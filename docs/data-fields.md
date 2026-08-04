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
| `id` | integer | Yes | Database-assigned ticket id |
| `question` | string | Yes | Original validated question |
| `answer` | string | Yes | AI-generated answer or fallback text |
| `source` | array of strings | Yes | Source labels returned by the model or fallback source |
| `ticket_category` | string | Yes | Must follow the approved backend taxonomy |
| `impact` | string | Yes | `low`, `medium`, or `high` |
| `urgency` | string | Yes | `low`, `medium`, or `high` |
| `priority` | string | Yes | `P1`, `P2`, `P3`, or `P4` |
| `sla` | string | Yes | `4 Hours`, `8 Hours`, `24 Hours`, or `48 Hours` |
| `escalation_team` | string | Yes | Determined from priority and category |
| `suggested_reply` | string | Yes | AI-generated reply or fallback text |
| `status` | string | Yes | `Open`, `In Progress`, `Resolved`, or `Closed` |
| `created_at` | ISO date-time string | Yes | Creation timestamp |

## Feedback request

| Field | Type | Required | Validation |
|---|---|---:|---|
| `ticket_id` | integer | Yes | Positive integer; must reference an existing ticket |
| `rating` | integer | Yes | From 1 to 5 |
| `comment` | string | No | Empty allowed; maximum 1000 characters |

## Feedback response data

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Database-assigned feedback id |
| `ticket_id` | integer | The ticket this feedback is for |
| `rating` | integer | Submitted rating |
| `comment` | string | Empty string when omitted |
| `created_at` | ISO date-time string | Creation timestamp |
