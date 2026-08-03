import { useId, useRef, useState } from "react";
import { QUESTION_MAX, QUESTION_MIN } from "../types/ticket";

interface Props {
  onSubmit: (question: string) => void;
  loading: boolean;
  /** Validation messages returned by the server (400). */
  serverErrors?: string[];
  initialValue?: string;
}

export default function AskForm({
  onSubmit,
  loading,
  serverErrors,
  initialValue = "",
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const trimmed = value.trim();

  /**
   * Mirrors schemas/supportRequest.schema.js. Checking here means an
   * obviously invalid request never leaves the browser — but the server
   * still validates, and its messages take priority when they arrive.
   */
  const localError =
    trimmed.length === 0
      ? "Question cannot be empty."
      : trimmed.length < QUESTION_MIN
        ? `Question must contain at least ${QUESTION_MIN} characters.`
        : trimmed.length > QUESTION_MAX
          ? "Question exceeds maximum length."
          : null;

  const errors = serverErrors?.length
    ? serverErrors
    : touched && localError
      ? [localError]
      : [];
  const hasError = errors.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (localError) {
      inputRef.current?.focus();
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="f" htmlFor={id}>
        What does the customer need help with?
      </label>
      <p className="hint" id={hintId}>
        Paste their message or describe the problem. Between {QUESTION_MIN} and{" "}
        {QUESTION_MAX} characters.
      </p>

      <textarea
        id={id}
        ref={inputRef}
        className={`f${hasError ? " invalid" : ""}`}
        value={value}
        disabled={loading}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${hintId} ${errorId}` : hintId}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. I paid for the Pro plan yesterday but my account still shows Free."
      />

      {hasError && (
        <div className="field-err" id={errorId}>
          {errors.map((msg) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      )}

      <div className="f-foot">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Working…" : "Get grounded answer"}
        </button>
        <button
          className="btn ghost"
          type="button"
          disabled={loading || value === ""}
          onClick={() => {
            setValue("");
            setTouched(false);
            inputRef.current?.focus();
          }}
        >
          Clear
        </button>
        <span className={`count${trimmed.length > QUESTION_MAX ? " bad" : ""}`}>
          {trimmed.length} / {QUESTION_MAX}
        </span>
      </div>
    </form>
  );
}
