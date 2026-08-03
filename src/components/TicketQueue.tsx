import { useCallback, useEffect, useMemo, useState } from "react";
import type { Priority, Ticket, TicketStatus } from "../types/ticket";
import { PRIORITIES, STATUSES } from "../types/ticket";
import { categoryLabel } from "../lib/labels";
import { getTickets } from "../lib/api";
import { EmptyState } from "./States";

type QueueState =
  | { kind: "loading" }
  | { kind: "success"; tickets: Ticket[] }
  | { kind: "error"; message: string };

/** Mirrors the PriorityMatrix ordering — P1 is most severe. */
const PRIORITY_RANK: Record<Priority, number> = { P1: 0, P2: 1, P3: 2, P4: 3 };

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ticketCode(id: number): string {
  return `TCK-${String(id).padStart(4, "0")}`;
}

function formatDate(iso?: string): string {
  const parsed = iso ? new Date(iso) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "—";
}

export default function TicketQueue({
  onAsk,
  onSelectTicket,
}: {
  onAsk: () => void;
  onSelectTicket: (id: number) => void;
}) {
  const [state, setState] = useState<QueueState>({ kind: "loading" });
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<TicketStatus[]>([]);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      setState({ kind: "success", tickets: await getTickets() });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Could not load the queue.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    if (state.kind !== "success") return [];
    return [...state.tickets].sort((a, b) => {
      const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (byPriority !== 0) return byPriority;
      return (Date.parse(b.created_at ?? "") || 0) - (Date.parse(a.created_at ?? "") || 0);
    });
  }, [state]);

  const filtered = useMemo(
    () =>
      sorted.filter((t) => {
        const matchesPriority = priorities.length === 0 || priorities.includes(t.priority);
        const matchesStatus = statuses.length === 0 || statuses.includes(t.status);
        return matchesPriority && matchesStatus;
      }),
    [sorted, priorities, statuses]
  );

  if (state.kind === "loading") {
    return (
      <>
        <h2>Ticket queue</h2>
        <section aria-busy="true" aria-label="Loading ticket queue">
          <ul className="queue-list">
            {[0, 1, 2].map((i) => (
              <li key={i} className="queue-row">
                <div
                  className="sk line"
                  style={{ gridColumn: "1 / -1", width: `${88 - i * 14}%` }}
                />
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  if (state.kind === "error") {
    return (
      <>
        <h2>Ticket queue</h2>
        <section role="alert">
          <div className="alert err">
            <span className="ic">!</span>
            <div>
              <strong>Could not load the queue.</strong>
              {state.message}
            </div>
          </div>
          <div className="f-foot">
            <button className="btn" type="button" onClick={load}>
              Retry
            </button>
          </div>
        </section>
      </>
    );
  }

  if (state.tickets.length === 0) {
    return (
      <>
        <h2>Ticket queue</h2>
        <EmptyState onAsk={onAsk} />
      </>
    );
  }

  return (
    <>
      <h2>Ticket queue</h2>

      <div className="queue-filters">
        <fieldset>
          <legend className="f">Priority</legend>
          <div className="chips" role="group" aria-label="Filter by priority">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={`chip${priorities.includes(p) ? " on" : ""}`}
                aria-pressed={priorities.includes(p)}
                onClick={() => setPriorities((list) => toggle(list, p))}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="f">Status</legend>
          <div className="chips" role="group" aria-label="Filter by status">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip${statuses.includes(s) ? " on" : ""}`}
                aria-pressed={statuses.includes(s)}
                onClick={() => setStatuses((list) => toggle(list, s))}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div aria-live="polite" aria-label="Queue results">
        <p className="count">
          Showing {filtered.length} of {sorted.length} tickets
        </p>

        {filtered.length === 0 ? (
          <div className="empty">
            <h3>No tickets match these filters</h3>
            <p>Try a different combination, or clear the filters to see the full queue.</p>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setPriorities([]);
                setStatuses([]);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="queue-list">
            {filtered.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="queue-row"
                  onClick={() => onSelectTicket(t.id)}
                >
                  <span className="qc-id">{ticketCode(t.id)}</span>
                  <span className="qc-q" title={t.question}>
                    {t.question}
                  </span>
                  <span className={`badge b-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  <span className="badge b-plain">{t.status}</span>
                  <span className="qc-meta">
                    {categoryLabel(t.ticket_category)} · {t.sla} · {formatDate(t.created_at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
