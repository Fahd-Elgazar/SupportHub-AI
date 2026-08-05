import { useState } from "react";

const CAPABILITIES = [
  "Answers grounded only in approved documentation — never invented",
  "Impact, urgency, priority and SLA calculated by deterministic rules",
  "Automatic ticket categorisation and escalation-team routing",
  "A ready-to-edit reply drafted alongside every triage",
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
        <h3>What this does</h3>
        <ul className="cap-list">
          {CAPABILITIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Try an example</h3>
        <ul className="example-list">
          {EXAMPLES.map((q) => (
            <ExampleRow key={q} question={q} />
          ))}
        </ul>
      </section>

      <section>
        <h3>Getting a good answer</h3>
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
