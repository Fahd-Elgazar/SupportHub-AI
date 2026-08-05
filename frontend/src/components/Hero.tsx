import { motion } from "framer-motion";

/** Lightweight intro above the Ask form — orientation, not marketing. */
export default function Hero() {
  return (
    <motion.section
      className="hero"
      aria-label="About SupportHub AI"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1>SupportHub AI</h1>
      <p>
        Paste a customer&rsquo;s message and get a grounded answer, a
        deterministic priority, and a ready-to-send reply — in seconds.
      </p>
      <div className="hero-pills">
        <span className="badge b-plain">Grounded answers</span>
        <span className="badge b-plain">Deterministic priority &amp; SLA</span>
        <span className="badge b-plain">Automatic escalation routing</span>
      </div>
    </motion.section>
  );
}
