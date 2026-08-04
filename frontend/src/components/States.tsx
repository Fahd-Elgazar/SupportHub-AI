/** Loading, failure and empty states. Each one is a screen an agent can act from. */

export function LoadingState() {
  return (
    <section aria-busy="true" aria-label="Loading result">
      <p className="working">
        Reading approved documentation and triaging the ticket.
      </p>

      <div className="zone z-gen">
        <div className="zone-tag">
          <span className="dot" />
          Generated
        </div>
        <div className="sk line" style={{ width: "94%" }} />
        <div className="sk line" style={{ width: "88%" }} />
        <div className="sk line" style={{ width: "61%" }} />
      </div>

      <div className="zone z-calc">
        <div className="zone-tag">
          <span className="dot" />
          Calculated
        </div>
        <dl className="kv">
          {["Priority", "SLA", "Escalation team"].map((k) => (
            <div key={k}>
              <dt className="k">{k}</dt>
              <dd>
                <div className="sk line tall" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

interface FailedProps {
  message: string;
  question: string;
  onRetry: () => void;
  onFileManually: () => void;
}

export function FailedState({
  message,
  question,
  onRetry,
  onFileManually,
}: FailedProps) {
  return (
    <section role="alert">
      <div className="alert err">
        <span className="ic">!</span>
        <div>
          <strong>The answer service didn&rsquo;t respond.</strong>
          {message}
        </div>
      </div>

      <div className="f-foot">
        <button className="btn" type="button" onClick={onRetry}>
          Try again
        </button>
        <button className="btn ghost" type="button" onClick={onFileManually}>
          File ticket without an answer
        </button>
      </div>

      <div className="saved">
        <div className="k">Your question</div>
        &ldquo;{question}&rdquo;
      </div>
    </section>
  );
}

export function EmptyState({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="empty">
      <h3>No tickets in the queue</h3>
      <p>
        Nothing has been triaged yet. Ask a support question and it&rsquo;ll
        appear here with its priority and response target.
      </p>
      <button className="btn" type="button" onClick={onAsk}>
        Ask a question
      </button>
    </div>
  );
}
