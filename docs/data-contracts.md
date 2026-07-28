\# Data and Interface Contracts



\## 1. Knowledge Search Request



| Field | Type | Required | Owner |

|---|---|---:|---|

| request\_id | string | Yes | Application |

| question | string | Yes | User |

| locale | string | No | Application |

| allowed\_source\_ids | array or null | No | Application |



\### Validation Rules



\- `question` must not be empty or whitespace-only.

\- The question must respect the approved maximum length.

\- User text cannot expand the approved source scope.

\- Secrets and unnecessary personal information should not be included.



\---



\## 2. Knowledge Search Response



| Field | Type | Required |

|---|---|---:|

| request\_id | string | Yes |

| result\_status | enum | Yes |

| answer | string or null | Yes |

| citations | array | Yes |

| requires\_human\_review | boolean | Yes |

| limitations | array | Yes |



\### Allowed Result Status



\- `grounded`

\- `partial`

\- `not\_found`

\- `conflicting\_sources`

\- `error`



\### Rules



\- A grounded answer requires at least one approved citation.

\- A not-found response must not contain an invented answer.

\- Conflicting sources require deterministic resolution or human review.



\---



\## 3. AI Triage Proposal



| Field | Type | Required |

|---|---|---:|

| proposed\_ticket\_category | enum | Yes |

| proposed\_impact | enum | Yes |

| proposed\_urgency | enum | Yes |

| rationale | string | Yes |

| evidence\_spans | array | No |

| uncertainty\_flags | array | Yes |



This contract represents an AI proposal only.



The AI must not authoritatively assign:



\- priority

\- SLA

\- escalation team

\- final status



\---



\## 4. Priority and SLA Input



| Field | Type | Required |

|---|---|---:|

| impact | enum | Yes |

| urgency | enum | Yes |

| policy\_version | string | Yes |

| calculated\_at | datetime | Yes |



\## 5. Priority and SLA Result



| Field | Type | Required |

|---|---|---:|

| priority | enum | Yes |

| sla\_policy\_id | string | Yes |

| first\_response\_due\_at | datetime or null | No |

| resolution\_due\_at | datetime or null | No |

| calculation\_reason\_code | string | Yes |

| manual\_review\_required | boolean | Yes |



\### Deterministic Requirements



\- The same validated input and policy version must produce the same result.

\- Unknown values must not be silently accepted.

\- Missing matrix combinations require manual review.

\- AI text cannot override the result.



\---



\## 6. Escalation Input



| Field | Type | Required |

|---|---|---:|

| ticket\_category | enum | Yes |

| priority | enum | Yes |

| security\_flag | boolean | Yes |

| service\_outage\_flag | boolean | Yes |

| policy\_version | string | Yes |



\## 7. Escalation Result



| Field | Type | Required |

|---|---|---:|

| escalation\_team | enum | Yes |

| route\_reason\_code | string | Yes |

| escalation\_required | boolean | Yes |

| manual\_review\_required | boolean | Yes |



\### Recommended Precedence



1\. Security override

2\. Critical outage override

3\. Other high-risk override

4\. Category and priority routing

5\. Manual-review fallback



This order requires team approval.



\---



\## 8. Final Ticket Record



Required product fields:



\- question

\- answer

\- source

\- ticket\_category

\- impact

\- urgency

\- priority

\- sla

\- escalation\_team

\- suggested\_reply

\- status



Recommended provenance fields:



\- ticket\_id

\- citations

\- knowledge\_result\_status

\- requires\_human\_review

\- knowledge\_version

\- taxonomy\_version

\- priority\_policy\_version

\- routing\_policy\_version

\- prompt\_version

\- model\_version

\- created\_at

\- updated\_at

\- decision\_log



\---



\## 9. Feedback Contract



| Field | Type | Required |

|---|---|---:|

| feedback\_id | string | Yes |

| ticket\_id | string | Yes |

| actor\_type | enum | Yes |

| rating | enum | Yes |

| reason\_codes | array | No |

| corrected\_answer | string or null | No |

| corrected\_category | enum or null | No |

| correction\_notes | string or null | No |

| created\_at | datetime | Yes |



Feedback must create a review candidate. It must not automatically update approved knowledge.

