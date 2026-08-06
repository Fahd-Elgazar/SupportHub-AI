import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpenCheck,
  Calculator,
  Info,
  UserCog,
  MessageSquareHeart,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { Ticket, TicketStatus } from "../types/ticket";
import { categoryLabel, levelLabel } from "../lib/labels";
import {
  getTicketFeedback,
  submitFeedback,
  updateTicketStatus,
} from "../lib/api";
import PriorityMatrix from "./PriorityMatrix";

/**
 * The three zones — Generated, Evidence, Calculated — are visually distinct
 * on purpose. An agent must never mistake a model sentence for a policy rule
 * or a computed response target.
 *
 * `mode` decides the audience. "customer" is what the person who asked the
 * question sees right after asking — just the answer and its sources, never
 * the triage internals. "agent" is the full workspace view used from the
 * Queue / Ticket Detail: priority matrix, escalation, reply drafting,
 * lifecycle actions, and the knowledge-team feedback form all belong there,
 * not in front of the customer.
 */

interface ResultViewProps {
  ticket: Ticket;
  mode: "customer" | "agent";
  /** Agent mode only: called after a status change succeeds, so the parent
   *  screen (e.g. Ticket Detail) can keep its own copy of the ticket in sync
   *  without a full refetch. */
  onTicketChange?: (ticket: Ticket) => void;
}

export default function ResultView({ ticket, mode, onTicketChange }: ResultViewProps) {
  const [liveTicket, setLiveTicket] = useState(ticket);

  useEffect(() => {
    setLiveTicket(ticket);
  }, [ticket]);

  const grounded = liveTicket.source.length > 0 && liveTicket.answer.trim() !== "";
  const isAgent = mode === "agent";

  function handleStatusChange(updated: Ticket) {
    setLiveTicket(updated);
    onTicketChange?.(updated);
  }

  return (
    <section aria-live="polite" aria-label="Triage result">
      <header className="result-head">
        <h2>{grounded ? "Grounded answer" : "No grounded answer"}</h2>
        <span className="badge b-plain">
          TCK-{String(liveTicket.id).padStart(4, "0")}
        </span>
        {isAgent && (
          <span className={`badge b-${liveTicket.priority.toLowerCase()}`}>
            {liveTicket.priority} · {liveTicket.sla}
          </span>
        )}
        <span className="badge b-plain push">{liveTicket.status}</span>
      </header>
      <p className="asked">&ldquo;{liveTicket.question}&rdquo;</p>

      {grounded ? (
        <GeneratedZone answer={liveTicket.answer} />
      ) : (
        <UnsupportedNotice team={liveTicket.escalation_team} />
      )}

      <EvidenceZone sources={liveTicket.source} />

      {isAgent ? (
        <>
          <CalculatedZone ticket={liveTicket} />

          <div className="section-block">
            <p className="section-label">
              <UserCog size={14} className="section-icon" aria-hidden="true" />
              Agent actions
            </p>
            <StatusActions
              ticket={liveTicket}
              grounded={grounded}
              onStatusChange={handleStatusChange}
            />
            {grounded && (
              <ReplyEditor ticket={liveTicket} onStatusChange={handleStatusChange} />
            )}
          </div>

          <div className="section-block">
            <p className="section-label">
              <MessageSquareHeart size={14} className="section-icon" aria-hidden="true" />
              Knowledge feedback
            </p>
            <FeedbackForm ticketId={liveTicket.id} />
          </div>
        </>
      ) : (
        <p className="saved">
          Your request has been logged as{" "}
          <strong>TCK-{String(liveTicket.id).padStart(4, "0")}</strong>. If
          this doesn&rsquo;t fully answer your question, our team will follow
          up.
        </p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function GeneratedZone({ answer }: { answer: string }) {
  return (
    <div className="zone z-gen">
      <div className="zone-tag">
        <Sparkles size={14} className="zone-icon" aria-hidden="true" />
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
      <Info size={18} className="ic" aria-hidden="true" />
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
          <BookOpenCheck size={14} className="zone-icon" aria-hidden="true" />
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
        <BookOpenCheck size={14} className="zone-icon" aria-hidden="true" />
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
        <Calculator size={14} className="zone-icon" aria-hidden="true" />
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

/**
 * The ticket's actual lifecycle actions — Escalate (Open -> In Progress) and
 * Mark Resolved (In Progress -> Resolved). Deliberately separate from
 * ReplyEditor: these apply regardless of whether a reply was drafted (an
 * ungrounded ticket still needs to be escalated to a human), while
 * ReplyEditor's actions only make sense when there's a drafted reply.
 *
 * The generic "Mark resolved" action only shows for ungrounded tickets.
 * A grounded ticket has a reply to send, and ReplyEditor's "Send reply" is
 * the intended path to Resolved for those — showing both would just be two
 * buttons doing almost the same thing.
 *
 * Closed is intentionally not exposed here — a minimal, forward-only
 * Open -> In Progress -> Resolved flow is what the product needs today;
 * adding a fourth step is trivial later but isn't needed yet.
 */
function StatusActions({
  ticket,
  grounded,
  onStatusChange,
}: {
  ticket: Ticket;
  grounded: boolean;
  onStatusChange: (ticket: Ticket) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  /** Set only after a transition this session actually succeeds — a
   *  confirmation of the action just taken, not a permanent status readout
   *  (the badge in the header already covers that on every future view). */
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function transition(status: TicketStatus, confirmMessage: string) {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    const updated = await updateTicketStatus(ticket.id, status);
    setBusy(false);
    if (updated) {
      setConfirmation(confirmMessage);
      onStatusChange(updated);
    } else {
      setFailed(true);
    }
  }

  return (
    <div className="status-actions">
      {ticket.status === "Open" && (
        <button
          className="btn ghost"
          type="button"
          disabled={busy}
          onClick={() =>
            transition(
              "In Progress",
              `Escalated to ${ticket.escalation_team}. Status changed to In Progress.`
            )
          }
        >
          {busy ? "Escalating…" : `Escalate to ${ticket.escalation_team}`}
        </button>
      )}

      {ticket.status === "In Progress" && !grounded && (
        <button
          className="btn ghost"
          type="button"
          disabled={busy}
          onClick={() => transition("Resolved", "Ticket marked resolved.")}
        >
          {busy ? "Updating…" : "Mark resolved"}
        </button>
      )}

      {confirmation && (
        <motion.span
          className="status-confirm"
          role="status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <CheckCircle2 size={15} aria-hidden="true" />
          {confirmation}
        </motion.span>
      )}

      {failed && (
        <span className="field-err">Couldn&rsquo;t update status. Try again.</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ReplyEditor({
  ticket,
  onStatusChange,
}: {
  ticket: Ticket;
  onStatusChange: (ticket: Ticket) => void;
}) {
  const [draft, setDraft] = useState(ticket.suggested_reply);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const id = useId();

  // A new ticket must reset the editor, or the previous draft leaks into it.
  useEffect(() => {
    setDraft(ticket.suggested_reply);
    setCopied(false);
    setSending(false);
    setSendFailed(false);
  }, [ticket.id, ticket.suggested_reply]);

  const edited = draft !== ticket.suggested_reply;
  const alreadySent = ticket.status === "Resolved" || ticket.status === "Closed";

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  async function sendReply() {
    if (sending || alreadySent) return;
    setSending(true);
    setSendFailed(false);
    const updated = await updateTicketStatus(ticket.id, "Resolved", draft);
    setSending(false);
    if (updated) onStatusChange(updated);
    else setSendFailed(true);
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
        disabled={alreadySent}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="f-foot">
        <button className="btn ghost" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy reply"}
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={!edited || alreadySent}
          onClick={() => setDraft(ticket.suggested_reply)}
        >
          Revert to suggested reply
        </button>
      </div>

      {alreadySent ? (
        <motion.p
          className="sent"
          role="status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          Reply sent successfully (simulated). Ticket marked {ticket.status}.
        </motion.p>
      ) : (
        <div className="f-foot">
          <button className="btn" type="button" disabled={sending} onClick={sendReply}>
            {sending ? "Sending…" : "Send reply"}
          </button>
          {sendFailed && (
            <span className="field-err">Couldn&rsquo;t send. Try again.</span>
          )}
        </div>
      )}
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
  const [checking, setChecking] = useState(true);
  const [existingComment, setExistingComment] = useState("");
  const id = useId();

  // Re-check for existing feedback whenever the ticket changes, so
  // reopening an already-rated ticket shows what was submitted instead of
  // silently offering a blank form again.
  useEffect(() => {
    setRating(null);
    setComment("");
    setSent(false);
    setSending(false);
    setFailed(false);
    setChecking(true);
    setExistingComment("");

    let cancelled = false;
    getTicketFeedback(ticketId).then((existing) => {
      if (cancelled) return;
      setChecking(false);
      if (existing) {
        setRating(existing.rating);
        setExistingComment(existing.comment);
        setSent(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  if (checking) {
    return (
      <p className="quiet">
        <Loader2 size={14} className="spin" aria-hidden="true" />
        Checking for existing feedback…
      </p>
    );
  }

  if (sent) {
    return (
      <motion.p
        className="sent"
        role="status"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        Feedback recorded — rated {rating}/5
        {existingComment && <>: &ldquo;{existingComment}&rdquo;</>}. Thanks —
        it tells the knowledge team which documentation is working.
      </motion.p>
    );
  }

  async function send() {
    if (rating === null || sending) return;
    setSending(true);
    setFailed(false);
    const trimmedComment = comment.trim();
    const ok = await submitFeedback({
      ticket_id: ticketId,
      rating,
      comment: trimmedComment || undefined,
    });
    setSending(false);
    if (ok) {
      setExistingComment(trimmedComment);
      setSent(true);
    } else {
      setFailed(true);
    }
  }

  return (
    <div className="feedback">
      <fieldset>
        <legend className="f">Rate this AI-generated answer</legend>
        <p className="hint">
          For the knowledge team, not the customer — flags whether this
          answer was accurate and well-grounded, so documentation gaps get
          fixed.
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
