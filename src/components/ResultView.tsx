import { useEffect, useId, useState } from "react";
import type { Ticket } from "../types/ticket";
import { categoryLabel, levelLabel } from "../lib/labels";
import { submitFeedback } from "../lib/api";
import PriorityMatrix from "./PriorityMatrix";

/**
 * The three zones — Generated, Evidence, Calculated — are visually distinct
 * on purpose. An agent must never mistake a model sentence for a policy rule
 * or a computed response target.
 */

export default function ResultView({ ticket }: { ticket: Ticket }) {
  const grounded = ticket.source.length > 0 && ticket.answer.trim() !== "";

  return (
    <section aria-live="polite" aria-label="Triage result">
      <header className="result-head">
        <h2>{grounded ? "Grounded answer" : "No grounded answer"}</h2>
        <span className="badge b-plain">
          TCK-{String(ticket.id).padStart(4, "0")}
        </span>
        <span className={`badge b-${ticket.priority.toLowerCase()}`}>
          {ticket.priority} · {ticket.sla}
        </span>
        <span className="count push">status: {ticket.status}</span>
      </header>
      <p className="asked">&ldquo;{ticket.question}&rdquo;</p>

      {grounded ? (
        <GeneratedZone answer={ticket.answer} />
      ) : (
        <UnsupportedNotice team={ticket.escalation_team} />
      )}

      <EvidenceZone sources={ticket.source} />
      <CalculatedZone ticket={ticket} />

      {grounded && <ReplyEditor ticket={ticket} />}
      <FeedbackForm ticketId={ticket.id} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function GeneratedZone({ answer }: { answer: string }) {
  return (
    <div className="zone z-gen">
      <div className="zone-tag">
        <span className="dot" />
        Generated · model answer
      </div>
      {answer.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

function UnsupportedNotice({ team }: { team: string }) {
  return (
    <div className="alert warn" role="status">
      <span className="ic">?</span>
      <div>
        <strong>Nothing in the approved documentation covers this.</strong>
        No answer has been drafted. The ticket has still been categorised and
        routed to the {team} so a person can pick it up.
      </div>
    </div>
  );
}

function EvidenceZone({ sources }: { sources: string[] }) {
  if (sources.length === 0) {
    return (
      <div className="zone z-src empty-src">
        <div className="zone-tag">
          <span className="dot" />
          Evidence · none
        </div>
        <p className="quiet">
          No approved source was returned, so nothing is claimed as fact here.
        </p>
      </div>
    );
  }

  return (
    <div className="zone z-src">
      <div className="zone-tag">
        <span className="dot" />
        Evidence · {sources.length} approved{" "}
        {sources.length === 1 ? "source" : "sources"}
      </div>
      <ol className="srclist">
        {sources.map((s, i) => (
          <li key={s}>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CalculatedZone({ ticket }: { ticket: Ticket }) {
  return (
    <div className="zone z-calc">
      <div className="zone-tag">
        <span className="dot" />
        Calculated · deterministic tools
      </div>

      <dl className="kv">
        <Cell k="Category" v={categoryLabel(ticket.ticket_category)} />
        <Cell k="Impact" v={levelLabel(ticket.impact)} />
        <Cell k="Urgency" v={levelLabel(ticket.urgency)} />
        <Cell
          k="Priority"
          v={ticket.priority}
          big
          className={`p-${ticket.priority.toLowerCase()}`}
        />
        <Cell k="SLA" v={ticket.sla} big />
        <Cell k="Escalation team" v={ticket.escalation_team} />
      </dl>

      <PriorityMatrix
        impact={ticket.impact}
        urgency={ticket.urgency}
        priority={ticket.priority}
        escalationTeam={ticket.escalation_team}
        category={ticket.ticket_category}
      />
    </div>
  );
}

function Cell({
  k,
  v,
  big,
  className,
}: {
  k: string;
  v: string;
  big?: boolean;
  className?: string;
}) {
  return (
    <div>
      <dt className="k">{k}</dt>
      <dd className={`v${big ? " big" : ""}${className ? ` ${className}` : ""}`}>
        {v}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ReplyEditor({ ticket }: { ticket: Ticket }) {
  const [draft, setDraft] = useState(ticket.suggested_reply);
  const [copied, setCopied] = useState(false);
  const id = useId();

  // A new ticket must reset the editor, or the previous draft leaks into it.
  useEffect(() => {
    setDraft(ticket.suggested_reply);
    setCopied(false);
  }, [ticket.id, ticket.suggested_reply]);

  const edited = draft !== ticket.suggested_reply;

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="reply">
      <label className="f" htmlFor={id}>
        Reply to the customer
      </label>
      <p className="hint">
        Drafted from the answer above. Edit before sending — you own what goes
        out.
      </p>
      <textarea
        id={id}
        className="f tall"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="f-foot">
        <button className="btn" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy reply"}
        </button>
        <button className="btn ghost" type="button">
          Escalate to {ticket.escalation_team}
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!edited}
          onClick={() => setDraft(ticket.suggested_reply)}
        >
          Reset to draft
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const RATINGS = [1, 2, 3, 4, 5] as const;

function FeedbackForm({ ticketId }: { ticketId: number }) {
  const [rating, setRating] = useState<(typeof RATINGS)[number] | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const id = useId();

  useEffect(() => {
    setRating(null);
    setComment("");
    setSent(false);
    setSending(false);
    setFailed(false);
  }, [ticketId]);

  if (sent) {
    return (
      <p className="sent" role="status">
        Feedback recorded. Thanks — it tells the knowledge owner which
        documentation is working.
      </p>
    );
  }

  async function send() {
    if (rating === null || sending) return;
    setSending(true);
    setFailed(false);
    const ok = await submitFeedback({
      ticket_id: ticketId,
      rating,
      comment: comment.trim() || undefined,
    });
    setSending(false);
    if (ok) setSent(true);
    else setFailed(true);
  }

  return (
    <div className="feedback">
      <fieldset>
        <legend className="f">Was this answer useful?</legend>
        <p className="hint">
          Ratings tell the knowledge owner which documentation is working.
        </p>
        <div className="chips">
          {RATINGS.map((n) => (
            <button
              key={n}
              type="button"
              className={`chip${rating === n ? " on" : ""}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="f" htmlFor={id}>
        Anything to add?
      </label>
      <input
        id={id}
        className="f"
        value={comment}
        maxLength={1000}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="f-foot">
        <button
          className="btn"
          type="button"
          disabled={rating === null || sending}
          onClick={send}
        >
          {sending ? "Submitting…" : "Submit feedback"}
        </button>
        <span className="count">ticket_id {ticketId}</span>
      </div>

      {failed && (
        <p className="field-err" role="status">
          Feedback couldn&rsquo;t be saved. Try again in a moment.
        </p>
      )}
    </div>
  );
}
