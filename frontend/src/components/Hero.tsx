import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
      <p className="hero-eyebrow">
        <Sparkles size={12} aria-hidden="true" />
        Internal AI Support Assistant
      </p>
      <h1>
        Support<span className="accent">Hub</span> AI
      </h1>
      <p>Every response is grounded in the approved knowledge base — nothing invented.</p>
      <div className="hero-pills">
        <span className="badge b-brand">Grounded answers</span>
        <span className="badge b-brand">Deterministic priority &amp; SLA</span>
        <span className="badge b-brand">Automatic escalation routing</span>
      </div>
    </motion.section>
  );
}
