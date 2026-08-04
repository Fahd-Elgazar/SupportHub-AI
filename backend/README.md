# SupportHub AI — Backend

Express + PostgreSQL API that takes a support question, classifies it with an
LLM (Groq, falling back to Gemini), applies deterministic priority/SLA/
escalation rules, and persists the resulting ticket.

## Stack

- Node.js, Express 5
- PostgreSQL via `pg` (raw parameterized SQL, no ORM)
- Joi for request/response validation
- Groq SDK (primary) and `@google/genai` (Gemini, fallback) for the AI provider
- Jest + Supertest for tests

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance
- A Groq API key (and optionally a Gemini API key for fallback)

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create the database and tables:
   ```
   psql -U postgres -d supporthub -f tables.sql
   ```
   (create the `supporthub` database first if it doesn't exist yet)
3. Copy the environment template and fill in real values:
   ```
   cp .env.example .env
   ```
4. Start the server:
   ```
   npm run dev    # nodemon, auto-restarts on change
   npm start      # plain node
   ```
   The API listens on `http://localhost:$PORT` (default `3000`).

## Environment variables

See `.env.example` for the full list with defaults. The ones with no safe
default that you must set yourself:

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Primary AI provider |
| `GEMINI_API_KEY` | Fallback AI provider, used only if the Groq call fails |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL connection |
| `CORS_ORIGIN` | Comma-separated list of origins allowed to call this API from a browser (must match wherever the frontend is actually served from) |

## API

Base path: `/api/supporthub-ai`

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Submit a question, get back a classified, persisted ticket |
| `POST` | `/feedback` | Submit feedback (`ticket_id`, `rating` 1–5, optional `comment`) for a ticket |
| `GET` | `/tickets` | List all tickets, newest first |
| `GET` | `/ticket/:id` | Get a single ticket by id (404 if not found) |
| `GET` | `/feedback` | List all feedback, joined with its ticket's question/category |
| `GET` | `/health` | Liveness check |
| `GET` | `/version` | API/prompt version and active AI provider |
| `GET` | `/validate` | Lightweight reachability check |

All responses use the envelope `{ success, message?, data?, count?, errors? }`.

### Ticket taxonomy

Defined once in `config/taxonomy.js` and enforced by
`schemas/supportResponse.schema.js`; every other module that classifies or
routes a ticket (`config/prompts.js`, `services/supportHub.service.js`,
`tools/escalationTool.js`) must use these exact values:

- `ticket_category`: `account_access`, `technical_issue`, `billing`,
  `product_question`, `security`, `service_outage`, `other`
- `impact` / `urgency`: `low`, `medium`, `high`
- `priority`: `P1`–`P4` (derived from impact × urgency, see
  `tools/priorityTool.js`)
- `status`: `Open`, `In Progress`, `Resolved`, `Closed`

## Testing

```
npm test
```

`tests/supportHub.test.js`, `tests/database.test.js`, and
`tests/providerFallback.test.js` exercise the live database and AI provider —
a configured `.env` (real DB, real `GROQ_API_KEY`) is required for the full
suite to pass. `tests/schema.test.js` is a pure unit test and needs neither.

## Project layout

```
config/       env, database pool, AI provider config, prompts, taxonomy
controllers/  request handlers
middleware/   validation, error handling, request logging
models/       parameterized SQL for tickets and feedback
routes/       route → controller wiring
schemas/      Joi request/response schemas
services/     business logic (AI call, normalization, rule application)
tools/        pure deterministic functions: priority, SLA, escalation
tables.sql    PostgreSQL schema (run manually — no migration tool yet)
```
