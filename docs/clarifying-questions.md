\# Clarifying Questions and Working Assumptions



\## Questions Requiring Team Confirmation



\### Knowledge Sources



1\. Who can approve, update, and retire knowledge documents?

2\. Are the FAQ, troubleshooting guide, and support policy the complete approved corpus for version 1?

3\. What source formats are supported?

4\. Must citations identify only the document, or also the section or chunk?

5\. What happens when two approved sources conflict?

6\. Does the support policy override the FAQ and troubleshooting guide?

7\. How frequently must approved sources be reviewed?



\### Ticket Taxonomy



1\. What are the final allowed ticket categories?

2\. What are the final impact and urgency levels?

3\. Is priority represented as P1–P4?

4\. Are impact and urgency selected by the user, proposed by AI, or confirmed by an agent?

5\. What should happen when the AI cannot determine a category?



\### SLA and Escalation



1\. Does SLA represent first-response time, resolution time, or both?

2\. Are SLAs calculated using calendar hours or business hours?

3\. What timezone and holiday calendar should be used?

4\. Which situations override the normal priority matrix?

5\. Which situations require immediate escalation?



\### Workflow



1\. What ticket statuses are allowed?

2\. Who may confirm resolution?

3\. Who may close a ticket?

4\. Is human approval required before sending every suggested reply?

5\. How long should ticket and audit records be retained?



\## Working Assumptions



Until the team confirms otherwise:



\- Only approved knowledge documents may be searched.

\- Support policy has higher authority than FAQ and troubleshooting content.

\- Every grounded answer must include a source.

\- Unsupported questions return `not\_found` and require manual review.

\- AI proposes category, impact, urgency, answer, and suggested reply.

\- Deterministic application logic calculates priority, SLA, routing, and status permissions.

\- Security and high-risk tickets cannot be automatically closed.

\- Agents confirm resolution.

\- SupportHub AI does not access private customer systems.

