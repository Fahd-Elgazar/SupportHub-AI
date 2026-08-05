import { Inbox, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { Ticket } from "../types/ticket";

function parseSlaHours(sla: string): number | null {
  const match = /(\d+)/.exec(sla);
  return match ? Number(match[1]) : null;
}

function isToday(iso?: string): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    !Number.isNaN(d.getTime()) &&
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/**
 * A lightweight dashboard strip above the ticket table — everything here is
 * derived client-side from the same ticket list the table renders, no extra
 * requests. "Resolved today" approximates using `created_at` since the API
 * doesn't return a resolved-at timestamp; close enough for an at-a-glance
 * count, not used anywhere data integrity depends on it.
 */
export default function QueueStats({ tickets }: { tickets: Ticket[] }) {
  const open = tickets.filter((t) => t.status === "Open").length;
  const critical = tickets.filter((t) => t.priority === "P1").length;
  const resolvedToday = tickets.filter(
    (t) => t.status === "Resolved" && isToday(t.created_at)
  ).length;

  const hours = tickets
    .map((t) => parseSlaHours(t.sla))
    .filter((h): h is number => h !== null);
  const avgSla = hours.length
    ? Math.round(hours.reduce((a, b) => a + b, 0) / hours.length)
    : null;

  const stats = [
    { icon: Inbox, label: "Open tickets", value: String(open) },
    { icon: AlertTriangle, label: "Critical (P1)", value: String(critical) },
    { icon: CheckCircle2, label: "Resolved today", value: String(resolvedToday) },
    { icon: Clock, label: "Avg. SLA target", value: avgSla !== null ? `${avgSla}h` : "—" },
  ];

  return (
    <div className="stats-grid" aria-label="Queue overview">
      {stats.map(({ icon: Icon, label, value }) => (
        <div className="stat-card" key={label}>
          <Icon size={18} className="stat-icon" aria-hidden="true" />
          <div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
