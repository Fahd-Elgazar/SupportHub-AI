# Acceptance Criteria

SupportHub AI is considered correct when:

| Requirement | Expected Result |
|------------|----------------|
| Grounded Answer | Every answer comes from approved documentation |
| Source Citation | Every answer identifies its source |
| Unsupported Question | Return "No approved answer found" instead of inventing an answer |
| Category | Matches official taxonomy |
| Priority | Calculated using deterministic rules |
| SLA | Matches the priority matrix |
| Escalation | Correct support team selected |
| Validation | Invalid input returns an error |
| Security | High-risk tickets are not automatically closed |
