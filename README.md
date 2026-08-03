# SupportHub AI — Frontend

Product UI & Workflow module for Team 09. Owned by **Jana Mohamed Hasabo**.

Vite + React + TypeScript. Talks to the Express API on the `backend` branch.

## Run it

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Ships with `VITE_USE_MOCK=true`, so it runs fully with **no backend and no API key**. This is deliberate: the handbook asks for the interface to work on deterministic data before it touches the real API, and it means the demo survives a provider outage.

In mock mode these keywords select a fixture:

| Type a question containing | You get |
|---|---|
| `down`, `outage` | P1 service outage, Critical Incident Team |
| `saml`, `sso`, `okta` | No approved source → escalation, no fabricated answer |
| anything else | P2 billing ticket with two sources |

To use the real API, set `VITE_USE_MOCK=false` and start the backend on port 3000. The Vite dev proxy forwards `/api` to it, which sidesteps CORS in development — **but production still needs `cors` middleware on the server.**

```bash
npm run typecheck    # tsc, no emit
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve the production build
```

## Structure

```
src/
  types/ticket.ts        Typed mirror of the Joi schemas — single source of truth
  lib/api.ts             Fetch client; returns RequestState, never throws at the UI
  lib/labels.ts          snake_case → human labels for all seven categories
  lib/mockData.ts        Deterministic fixtures for every result state
  components/
    AskForm.tsx          Input, character counter, validation
    ResultView.tsx       Three zones + reply editor + feedback
    PriorityMatrix.tsx   The impact × urgency grid
    States.tsx           Loading skeleton, failure, empty
  App.tsx                Request state machine
  styles.css             Design tokens
```

## The design decision to defend

Every result splits into three visually distinct zones:

- **Generated** (purple) — model text. Can vary between runs.
- **Evidence** (white, black rule) — approved sources. Empty when there are none.
- **Calculated** (teal) — deterministic tool output.

Inside the Calculated zone, `PriorityMatrix` renders the actual impact × urgency grid with the active cell lit, instead of just asserting a priority. This directly answers the graded criterion that *tool results must be clearly distinguishable from model explanation* — an agent can see the rule that produced P2, not just the letter.

## State coverage

`RequestState` in `types/ticket.ts` is a discriminated union, so no state can be silently forgotten:

`idle` · `loading` · `success` · `invalid` (recoverable, fix the input) · `failed` (retry or proceed manually)

Plus, within `success`: sources present vs. empty, and answer present vs. unsupported.

On failure the typed question is preserved and the retry re-sends it. Losing an agent's input on a 500 is the fastest way to make a tool hated.

## Accessibility

- Visible `<label>` on every input; placeholders are examples only
- Errors linked with `aria-describedby`, fields marked `aria-invalid`, focus moves to the input
- Result region is `aria-live="polite"`; loading zones are `aria-busy`
- Priority never communicated by colour alone — always the literal `P1`–`P4` text
- 44px minimum touch targets, visible focus rings, skip link
- `prefers-reduced-motion` disables the skeleton shimmer

## Known backend issues this UI works around

Reported to Alaa and Fahd — not fixed here, since they're outside this module.

1. **No CORS middleware.** Dev proxy covers local work; production will fail without it.
2. **Priority always returns P4** — `priorityTool.js` matches `"High"` against `"high"`. When the returned priority disagrees with the matrix, the UI shows an inline flag rather than silently displaying wrong data.
3. **Escalation team defaults to "Support Team"** — `escalationTool.js` switches on `Technical`/`Account` but receives `technical_issue`/`account_access`.
4. **Tickets may save twice** — both the service and the controller call `createTicket`.
5. **`docs/data-contracts.md` disagrees with the running code** on value casing and the feedback body. This UI follows the code.

## Verified

- `npm run typecheck` — clean
- `npm run build` — clean, 39 modules
- `npm run preview` — serves 200, bundle loads

Not yet checked in a real browser, on a real device, or with a screen reader. Do that before claiming the accessibility evidence.
