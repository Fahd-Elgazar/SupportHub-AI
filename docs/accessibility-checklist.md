# Accessibility checklist — WCAG 2.2 AA

Scope: the frontend only (Ask flow, Ticket Queue, Ticket Detail). Checked against
implemented code plus live testing in mock mode via desktop (1000px) and mobile
(375px) viewports. Contrast ratios below are computed directly from the CSS custom
properties in `src/styles.css` (relative-luminance formula, not eyeballed).

Not yet done: testing with an actual screen reader (VoiceOver/NVDA) or a real
keyboard-only pass beyond partial coverage noted below. This document is a code +
contrast audit, not a substitute for that.

## Passing

| SC | Requirement | Evidence |
|---|---|---|
| 1.1.1 Non-text Content (A) | Icons/decoration don't block understanding | Status icons (`!`, `?`) sit next to a `<strong>` text summary; no image content anywhere |
| 1.3.1 Info and Relationships (A) | Structure conveyed in markup, not just visually | `<label>`/`<fieldset><legend>` on every input; `<table>` with `<caption>`, `scope="col"/"row"` in `PriorityMatrix`; `<dl>` for key/value pairs |
| 1.3.5 Identify Input Purpose (AA) | N/A | Only free-text fields (question, feedback comment); no autocomplete-eligible personal data fields |
| 1.4.1 Use of Color (A) | Meaning not conveyed by color alone | Priority is always the literal `P1`–`P4` text alongside color; matrix cells carry text; badges carry text |
| 1.4.3 Contrast — text (AA) | ≥4.5:1 normal text, ≥3:1 large text | `--ink` on white: 17.84:1. `--slate` on white: 5.48:1. `--gen-ink`/`--signal` on their tints: 8.64:1 / 5.43:1. All former `--mist`-text usages now `--slate` (5.48:1); P2/P4 badges darkened to 4.68:1 / 4.60:1. See *Fixed* below. |
| 1.4.10 Reflow (AA) | No horizontal scroll at 320–400px | Verified live at 375px: Ask form, ResultView zones, Queue rows (stack to cards), Detail view all reflow with no horizontal overflow |
| 1.4.11 Non-text Contrast — focus rings (AA) | ≥3:1 | `:focus-visible` outline is `--signal` (`#0b6b68`) at 2px, ~7.7:1 against white — well clear |
| 1.4.11 Non-text Contrast — form/chip borders (AA) | ≥3:1 | New `--line-strong` (`#8494a2`) token, 3.12:1 against white — used on `textarea.f`/`input.f` and `.chip`. See *Fixed* below. |
| 1.4.12 Text Spacing (AA) | No loss of content at increased spacing | No fixed-height text containers that clip; line-height 1.5+ throughout |
| 1.4.13 Content on Hover/Focus (AA) | N/A | No hover-triggered tooltips/popovers other than the native `title` attribute on truncated queue questions (dismissible/hoverable by default OS behavior) |
| 2.1.1 Keyboard (A) | Everything operable without a mouse | All interactive elements are native `<button>`/`<textarea>`/`<a>`; verified via direct DOM interaction, no click-only handlers on non-interactive elements |
| 2.4.1 Bypass Blocks (A) | Skip link | `.skip` link to `#main`, first focusable element |
| 2.4.3 Focus Order (A) | Logical order | DOM order matches visual order everywhere; no `tabindex` overrides |
| 2.4.7 Focus Visible (AA) | Visible focus indicator | `:focus-visible` rings on buttons, chips, form fields |
| 2.4.11 Focus Not Obscured — Minimum (AA, new in 2.2) | Focused element not hidden by sticky content | No sticky/fixed-position overlays in the layout |
| 2.5.8 Target Size — Minimum (AA, new in 2.2) | ≥24×24px (with exceptions) | All buttons/chips/badges-as-buttons are 44×44px minimum — exceeds the requirement |
| 3.2.1 On Focus (A) | No context change on focus alone | Confirmed — filters/nav only act `onClick` |
| 3.3.1 Error Identification (A) | Errors described in text | `.field-err` text, not just red border |
| 3.3.2 Labels or Instructions (A) | Every field labeled | Confirmed throughout |
| 3.3.3 Error Suggestion (AA) | Errors say what to fix | "Question must contain at least 5 characters." etc. |
| 4.1.2 Name, Role, Value (A) | Custom controls expose state | Filter chips use `aria-pressed`; loading regions use `aria-busy`; live regions use `aria-live="polite"` |
| 4.1.3 Status Messages (AA) | Status updates announced without a focus move | `aria-live="polite"` on the result region and queue results; `role="alert"`/`role="status"` on errors/flags |

## Fixed

All three contrast findings from the initial audit have been fixed in `src/styles.css`:

**1.4.3 Contrast (Minimum) — `--mist` text was 2.91:1 (needs 4.5:1)**
`--mist` (`#8b99a6`) was used as actual *reading* text in several places, not
just decoration: `.hint`, `.count`, `.srclist .idx`, `.kv .k`, `.qc-id`,
`.matrix th`/`th.dim`/`td`, `.saved .k`, `.who`, `.foot`. All of these are small
text (10.5–12.5px), so the 3:1 "large text" exception didn't apply. Every one of
these now uses `--slate` (`#5a6b7c`, 5.48:1 on white) instead. `--mist` itself is
kept in the token list — commented as decorative/non-text use only — since
nothing currently reading uses it.

**1.4.3 Contrast (Minimum) — P2 and P4 priority badges failed narrowly**
Was P1 5.11:1 ✓, P2 4.37:1 ✗, P3 5.60:1 ✓, P4 4.35:1 ✗. `--p2` darkened from
`#a85e12` to `#a15a11` (now 4.68:1) and `--p4` from `#65717e` to `#626d7a` (now
4.60:1) — both small enough shifts to be visually indistinguishable from the
original palette side by side. Also re-verified the white text on the
`PriorityMatrix`'s active P2/P4 cells (which use these same tokens as a solid
background) — both still comfortably at 5.27:1.

**1.4.11 Non-text Contrast — form field and chip borders were 1.34:1 (needs 3:1)**
The textarea/input and unselected-chip borders sat on the same white background
as the field itself, so the border was the *only* boundary cue — and `--line`
(`#d8dfe6`) measured 1.34:1 against white. Added a new `--line-strong`
(`#8494a2`, 3.12:1) token used specifically for `textarea.f`/`input.f` and
`.chip` borders. `--line` itself is untouched everywhere else (e.g. the
decorative desktop card frame around `.wrap`, which isn't a required
component boundary under 1.4.11 and wasn't flagged).

Re-verified after the fix: `npm run typecheck`, `npm run build`, and
`npm run test` (26/26) all clean; visually confirmed live in the browser that
inputs/chips read as more clearly bounded and P2 badges look effectively
identical to before.

## Not yet verified (needs a human pass, not just code review)

- Real screen reader run (VoiceOver or NVDA) through: Ask → validate → submit →
  result → feedback; Queue → filter → open a ticket → back; the 404 path.
- Full keyboard-only pass with no mouse at all, including confirming chip
  toggle order and matrix table reading order make sense when tabbed through.
- Zoom to 200%/400% text-only zoom (distinct from the 1.4.10 reflow check above).
