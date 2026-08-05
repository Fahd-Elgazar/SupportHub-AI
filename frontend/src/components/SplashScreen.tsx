import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

/**
 * A brief branding moment on load — not tied to any real async init (there
 * isn't one on this page), just a deliberate pause so the app doesn't pop
 * straight to content. Purely decorative; App unmounts it on a timer.
 */
const MESSAGES = ["Loading knowledge base…", "Initializing AI assistant…"];

export default function SplashScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setMessageIndex(1), 550);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="splash"
      role="status"
      aria-label="Loading SupportHub AI"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.img
        src={logo}
        alt=""
        className="splash-logo"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.p
        key={messageIndex}
        className="splash-msg"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {MESSAGES[messageIndex]}
      </motion.p>
    </motion.div>
  );
}
