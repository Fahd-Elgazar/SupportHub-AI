import { Tags, Gauge, Route } from "lucide-react";

const STEPS = [
  {
    icon: Tags,
    title: "Classify",
    desc: "Category, impact and urgency are detected automatically.",
  },
  {
    icon: Gauge,
    title: "Prioritize",
    desc: "Impact × urgency maps to a deterministic P1–P4 priority.",
  },
  {
    icon: Route,
    title: "Route",
    desc: "Each ticket is escalated to the right team automatically.",
  },
];

/** Fills the quiet space below the form with a one-glance summary of what happens next. */
export default function TriageSteps() {
  return (
    <div className="triage-steps">
      {STEPS.map(({ icon: Icon, title, desc }) => (
        <div className="triage-step" key={title}>
          <Icon size={16} className="triage-step-icon" aria-hidden="true" />
          <div>
            <p className="triage-step-title">{title}</p>
            <p className="triage-step-desc">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
