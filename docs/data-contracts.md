# SupportHub AI API Contracts

## Base path

```text
/api/supporthub-ai
```

## 1. Generate support response

### Request

```http
POST /api/supporthub-ai
Content-Type: application/json
```

```json
{
  "question": "I cannot log in to my account."
}
```

### Success response — 200

```json
{
  "success": true,
  "message": "Ticket processed successfully.",
  "data": {
    "id": 1,
    "question": "I cannot log in to my account.",
    "answer": "...",
    "source": ["Internal Knowledge Base"],
    "ticket_category": "account_access",
    "impact": "low",
    "urgency": "low",
    "priority": "P4",
    "sla": "48 Hours",
    "escalation_team": "Account Support Team",
    "suggested_reply": "...",
    "status": "Open",
    "created_at": "..."
  }
}
```

The AI-generated text and classification can vary, but the response shape and allowed values must remain valid.

### Validation error — 400

```json
{
  "success": false,
  "errors": [
    "Question is required."
  ]
}
```

`errors` is an array of plain message strings (one per failed rule, from Joi's `error.details`), not objects with `field`/`message` keys. There is no top-level `message` field on this response. This applies to both `POST /api/supporthub-ai` and `POST /api/supporthub-ai/feedback`.

## 2. Submit feedback

### Request

```http
POST /api/supporthub-ai/feedback
Content-Type: application/json
```

```json
{
  "ticket_id": 1,
  "rating": 5,
  "comment": "Helpful response"
}
```

`ticket_id` must be the `id` of an existing ticket returned by the main endpoint. `comment` is optional.

### Success response — 201

```json
{
  "success": true,
  "message": "Feedback submitted successfully.",
  "data": {
    "id": 1,
    "ticket_id": 1,
    "rating": 5,
    "comment": "Helpful response",
    "created_at": "..."
  }
}
```

## 3. Health check

```http
GET /api/supporthub-ai/health
```

### Success response — 200

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "..."
}
```

## 4. Version information

```http
GET /api/supporthub-ai/version
```

### Success response — 200

```json
{
  "success": true,
  "api_version": "1.0.0",
  "prompt_version": "v1",
  "provider": "groq"
}
```

The provider value depends on environment configuration.

## 5. Validate request only

```http
GET /api/supporthub-ai/validate
```

This is a `GET` route, not `POST`. It takes no body and does not read the request at all — it unconditionally returns success. It does not perform any actual validation of a question; use `POST /api/supporthub-ai` itself (which validates before generating) to check whether a question would be accepted.

### Success response — 200

```json
{
  "success": true,
  "message": "Request is valid."
}
```

## 6. Unknown route

### Response — 404

```json
{
  "success": false,
  "message": "Route not found."
}
```

## Error behavior

Unhandled errors return:

```json
{
  "success": false,
  "message": "Internal server error."
}
```

In non-production mode, the backend may expose the underlying error message instead.
