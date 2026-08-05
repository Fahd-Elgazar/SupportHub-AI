import { useState } from "react";
import {
  ShieldCheck,
  Gauge,
  Route,
  FileEdit,
  Sparkles,
  MessageSquareText,
  Lightbulb,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: ShieldCheck,
    text: "Answers grounded only in approved documentation — never invented",
  },
  {
    icon: Gauge,
    text: "Impact, urgency, priority and SLA calculated by deterministic rules",
  },
  {
    icon: Route,
    text: "Automatic ticket categorisation and escalation-team routing",
  },
  {
    icon: FileEdit,
    text: "A ready-to-edit reply drafted alongside every triage",
  },
];

const EXAMPLES = [
  "My account got hacked and I can't recover it. The password reset link isn't working.",
  "I paid for the Pro plan yesterday but my account still shows Free.",
  "Everything is down, none of our team can log in at all.",
  "Where can I download my invoices?",
];

/** Right-hand rail on the Ask page: what the tool does, and how to get a good result from it. */
export default function AskInfoPanel() {
  return (
    <aside className="card ask-info" aria-label="About asking a question">
      <section>
        <h3>
          <Sparkles size={15} className="ask-info-icon" aria-hidden="true" />
          What this does
        </h3>
        <p className="section-desc">Four things happen automatically on every question.</p>
        <ul className="cap-list">
          {CAPABILITIES.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon size={14} className="cap-icon" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>
          <MessageSquareText size={15} className="ask-info-icon" aria-hidden="true" />
          Try an example
        </h3>
        <p className="section-desc">Copy one straight into the form on the left.</p>
        <ul className="example-list">
          {EXAMPLES.map((q) => (
            <ExampleRow key={q} question={q} />
          ))}
        </ul>
      </section>

      <section>
        <h3>
          <Lightbulb size={15} className="ask-info-icon" aria-hidden="true" />
          Getting a good answer
        </h3>
        <p className="hint">
          Paste the customer&rsquo;s message as close to verbatim as
          possible. More context (what they&rsquo;ve already tried, what
          exactly is failing) means a more specific triage and reply.
        </p>
      </section>
    </aside>
  );
}

function ExampleRow({ question }: { question: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className="example-row">
      <span>&ldquo;{question}&rdquo;</span>
      <button className="btn ghost sm" type="button" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </li>
  );
}
