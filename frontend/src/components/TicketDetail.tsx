import { useCallback, useEffect, useState } from "react";
import type { Ticket } from "../types/ticket";
import { getTicket } from "../lib/api";
import { LoadingState } from "./States";
import ResultView from "./ResultView";

type DetailState =
  | { kind: "loading" }
  | { kind: "found"; ticket: Ticket }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

export default function TicketDetail({
  id,
  onBack,
}: {
  id: number;
  onBack: () => void;
}) {
  const [state, setState] = useState<DetailState>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    const result = await getTicket(id);
    setState(result);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="f-foot">
        <button className="btn ghost" type="button" onClick={onBack}>
          ← Back to queue
        </button>
      </div>

      {state.kind === "loading" && <LoadingState />}

      {state.kind === "found" && (
        <ResultView
          ticket={state.ticket}
          mode="agent"
          onTicketChange={(ticket) => setState({ kind: "found", ticket })}
        />
      )}

      {state.kind === "not_found" && (
        <div className="empty">
          <h3>Ticket not found</h3>
          <p>
            TCK-{String(id).padStart(4, "0")} doesn&rsquo;t exist, or it may
            have been removed.
          </p>
          <button className="btn" type="button" onClick={onBack}>
            Back to queue
          </button>
        </div>
      )}

      {state.kind === "error" && (
        <section role="alert">
          <div className="alert err">
            <span className="ic">!</span>
            <div>
              <strong>Could not load this ticket.</strong>
              {state.message}
            </div>
          </div>
          <div className="f-foot">
            <button className="btn" type="button" onClick={load}>
              Retry
            </button>
          </div>
        </section>
      )}
    </>
  );
}
