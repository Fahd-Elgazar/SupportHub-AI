# SupportHub AI Initial Edge Cases

1. The user submits an empty question.

2. The question is unrelated to the supported product.

3. No approved source contains the answer.

4. Two approved sources provide conflicting information.

5. Impact is missing.

6. Urgency is missing.

7. The ticket category is unknown.

8. The user describes every issue as critical.

9. The ticket contains prompt-injection instructions.

10. A possible security issue is described as a normal login problem.

## Expected Safe Behavior

- The system must not invent unsupported answers.

- Missing required values must produce a validation error or manual-review state.

- Unknown categories must be sent to manual triage.

- Security-related issues must require human review.

- User instructions must not override system rules.
