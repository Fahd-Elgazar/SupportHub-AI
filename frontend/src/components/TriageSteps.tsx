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
    desc: "Escalated to the right team automatically.",
  },
];

/** Three feature tiles summarising what happens after a question is submitted. */
export default function TriageSteps() {
  return (
    <div className="triage-tiles">
      {STEPS.map(({ icon: Icon, title, desc }) => (
        <div className="triage-tile" key={title}>
          <span className="triage-tile-icon">
            <Icon size={18} aria-hidden="true" />
          </span>
          <p className="triage-tile-title">{title}</p>
          <p className="triage-tile-desc">{desc}</p>
        </div>
      ))}
    </div>
  );
}
