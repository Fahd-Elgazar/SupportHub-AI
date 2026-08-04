import { useCallback, useState } from "react";
import type { RequestState } from "./types/ticket";
import { askSupport, usingMockData } from "./lib/api";
import AskForm from "./components/AskForm";
import ResultView from "./components/ResultView";
import TicketQueue from "./components/TicketQueue";
import TicketDetail from "./components/TicketDetail";
import { FailedState, LoadingState } from "./components/States";
import logo from "./assets/logo.png";

export default function App() {
  const [activeView, setActiveView] = useState<"ask" | "queue">("ask");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [state, setState] = useState<RequestState>({ kind: "idle" });
  /** Kept separately so a failure never costs the agent their typed question. */
  const [lastQuestion, setLastQuestion] = useState("");

  const ask = useCallback(async (question: string) => {
    setLastQuestion(question);
    setState({ kind: "loading" });
    setState(await askSupport(question));
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>

      <header className="appbar">
        <div className="mark">
          <img src={logo} alt="SupportHub AI" className="mark-logo" />
        </div>
        <nav className="nav" aria-label="Main">
          <a
            href="#main"
            className={activeView === "ask" ? "on" : undefined}
            aria-current={activeView === "ask" ? "page" : undefined}
            onClick={() => {
              setActiveView("ask");
              setSelectedTicketId(null);
            }}
          >
            Ask
          </a>
          <a
            href="#main"
            className={activeView === "queue" ? "on" : undefined}
            aria-current={activeView === "queue" ? "page" : undefined}
            onClick={() => {
              setActiveView("queue");
              setSelectedTicketId(null);
            }}
          >
            Queue
          </a>
        </nav>
        <span className="who">
          {usingMockData ? "mock data · no server" : "connected"}
        </span>
      </header>

      <main id="main" className="wrap">
        {activeView === "ask" ? (
          <>
            <AskForm
              onSubmit={ask}
              loading={state.kind === "loading"}
              serverErrors={state.kind === "invalid" ? state.errors : undefined}
              initialValue={lastQuestion}
              key={state.kind === "idle" ? "fresh" : "kept"}
            />

            {state.kind === "loading" && <LoadingState />}

            {state.kind === "success" && <ResultView ticket={state.ticket} />}

            {state.kind === "failed" && (
              <FailedState
                message={state.message}
                question={lastQuestion}
                onRetry={() => ask(lastQuestion)}
                onFileManually={() => setState({ kind: "idle" })}
              />
            )}
          </>
        ) : selectedTicketId !== null ? (
          <TicketDetail
            id={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
          />
        ) : (
          <TicketQueue
            onAsk={() => setActiveView("ask")}
            onSelectTicket={setSelectedTicketId}
          />
        )}
      </main>

      <footer className="foot">
        <p>
          Team 09 · SupportHub AI · UI &amp; workflow owned by Jana Mohamed
          Hasabo
        </p>
      </footer>
    </>
  );
}
