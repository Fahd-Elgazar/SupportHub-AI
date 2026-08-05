import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { RequestState } from "./types/ticket";
import { askSupport, usingMockData } from "./lib/api";
import AskForm from "./components/AskForm";
import AskInfoPanel from "./components/AskInfoPanel";
import Hero from "./components/Hero";
import ResultView from "./components/ResultView";
import TicketQueue from "./components/TicketQueue";
import TicketDetail from "./components/TicketDetail";
import SplashScreen from "./components/SplashScreen";
import { FailedState, LoadingState } from "./components/States";
import logo from "./assets/logo.png";

/** Fade/slide used for the few top-level view swaps — subtle, not a full page transition library. */
const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const [activeView, setActiveView] = useState<"ask" | "queue">("ask");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [state, setState] = useState<RequestState>({ kind: "idle" });
  /** Kept separately so a failure never costs the agent their typed question. */
  const [lastQuestion, setLastQuestion] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1050);
    return () => clearTimeout(timer);
  }, []);

  const ask = useCallback(async (question: string) => {
    setLastQuestion(question);
    setState({ kind: "loading" });
    setState(await askSupport(question));
  }, []);

  const composing = state.kind !== "success";

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{booting && <SplashScreen />}</AnimatePresence>

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
        {usingMockData && <span className="who">Mock data · no server</span>}
      </header>

      <main id="main" className="wrap">
        {activeView === "ask" ? (
          <AnimatePresence mode="wait">
            {composing ? (
              <motion.div key="composing" {...fade}>
                <Hero />
                <div className="ask-columns">
                  <div className="card ask-form-col">
                    <AskForm
                      onSubmit={ask}
                      loading={state.kind === "loading"}
                      serverErrors={state.kind === "invalid" ? state.errors : undefined}
                      initialValue={lastQuestion}
                      key={state.kind === "idle" ? "fresh" : "kept"}
                    />

                    {state.kind === "loading" && <LoadingState />}

                    {state.kind === "failed" && (
                      <FailedState
                        message={state.message}
                        question={lastQuestion}
                        onRetry={() => ask(lastQuestion)}
                        onFileManually={() => setState({ kind: "idle" })}
                      />
                    )}
                  </div>

                  <AskInfoPanel />
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" className="card" {...fade}>
                {/* The input phase is over — collapse the form so the result
                    owns the screen, rather than letting the page grow forever
                    underneath a textarea that's no longer the point. */}
                <div className="f-foot">
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => setState({ kind: "idle" })}
                  >
                    ← Ask another question
                  </button>
                </div>

                {state.kind === "success" && (
                  <ResultView ticket={state.ticket} mode="customer" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {selectedTicketId !== null ? (
              <motion.div key={`ticket-${selectedTicketId}`} className="card" {...fade}>
                <TicketDetail
                  id={selectedTicketId}
                  onBack={() => setSelectedTicketId(null)}
                />
              </motion.div>
            ) : (
              <motion.div key="queue" className="card" {...fade}>
                <TicketQueue
                  onAsk={() => setActiveView("ask")}
                  onSelectTicket={setSelectedTicketId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <footer className="foot">
        <p className="foot-name">SupportHub AI</p>
        <p className="foot-desc">
          AI-assisted internal support platform for intelligent ticket
          triage, knowledge-grounded responses, and deterministic priority
          classification.
        </p>
        <p className="foot-copy">&copy; 2026 SupportHub AI</p>
      </footer>
    </MotionConfig>
  );
}
