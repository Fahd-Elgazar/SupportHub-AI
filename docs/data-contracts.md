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
  "data": {
    "question": "I cannot log in to my account.",
    "answer": "...",
    "source": ["Internal Knowledge Base"],
    "ticket_category": "Account",
    "impact": "Low",
    "urgency": "Low",
    "priority": "P4",
    "sla": "48 Hours",
    "escalation_team": "Account Support Team",
    "suggested_reply": "...",
    "status": "Open"
  }
}
```

The AI-generated text and classification can vary, but the response shape and allowed values must remain valid.

### Validation error — 400

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "question",
      "message": "Question is required."
    }
  ]
}
```

## 2. Submit feedback

### Request

```http
POST /api/supporthub-ai/feedback
Content-Type: application/json
```

```json
{
  "question": "Login issue",
  "answer": "Reset your password.",
  "rating": 5,
  "comment": "Helpful response"
}
```

### Success response — 201

```json
{
  "success": true,
  "message": "Feedback submitted successfully.",
  "data": {
    "id": "...",
    "question": "Login issue",
    "answer": "Reset your password.",
    "rating": 5,
    "comment": "Helpful response",
    "createdAt": "..."
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
POST /api/supporthub-ai/validate
Content-Type: application/json
```

```json
{
  "question": "Please validate this support request."
}
```

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
