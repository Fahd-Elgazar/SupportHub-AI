import type { Level, Priority } from "../types/ticket";
import { levelLabel, PRIORITY_SLA } from "../lib/labels";

/**
 * The impact x urgency matrix from calculate_priority_sla(), with the
 * active cell lit.
 *
 * The point is not decoration: an agent has to be able to see that priority
 * came from a fixed rule and not from the model. Asserting "P2" alone doesn't
 * show that; showing the rule does.
 */

const ROWS: Level[] = ["high", "medium", "low"];
const COLS: Level[] = ["high", "medium", "low"];

/** Mirrors tools/priorityTool.js — impact indexes the row, urgency the column. */
const MATRIX: Record<Level, Record<Level, Priority>> = {
  high: { high: "P1", medium: "P2", low: "P2" },
  medium: { high: "P2", medium: "P3", low: "P3" },
  low: { high: "P3", medium: "P4", low: "P4" },
};

interface Props {
  impact: Level;
  urgency: Level;
  /** Priority the server actually returned. */
  priority: Priority;
  escalationTeam: string;
  category: string;
}

export default function PriorityMatrix({
  impact,
  urgency,
  priority,
  escalationTeam,
  category,
}: Props) {
  const expected = MATRIX[impact]?.[urgency];
  const mismatch = expected !== undefined && expected !== priority;

  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <caption>calculate_priority_sla()</caption>
        <tbody>
          <tr>
            <th scope="col" />
            <th scope="col" colSpan={3}>
              Urgency
            </th>
          </tr>
          {ROWS.map((row) => (
            <tr key={row}>
              <th scope="row" className="rh">
                {levelLabel(row)}
              </th>
              {COLS.map((col) => {
                const value = MATRIX[row][col];
                const active = row === impact && col === urgency;
                return (
                  <td
                    key={col}
                    className={active ? `on p-${value.toLowerCase()}` : undefined}
                    aria-current={active ? "true" : undefined}
                  >
                    <span className="sr-only">
                      {levelLabel(row)} impact, {levelLabel(col)} urgency:{" "}
                    </span>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th scope="col" className="rh dim">
              Impact
            </th>
            {COLS.map((col) => (
              <th scope="col" key={col}>
                {levelLabel(col)}
              </th>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="matrix-read">
        <p>
          <strong>
            {levelLabel(impact)} impact &times; {levelLabel(urgency)} urgency
            &rarr; {priority}.
          </strong>
        </p>
        <p>
          {priority} carries a <code>{PRIORITY_SLA[priority]}</code> response
          target. Category <code>{category}</code> routes it to the{" "}
          {escalationTeam}.
        </p>
        <p className="quiet">
          No model judgement here. Same inputs, same output, every time.
        </p>

        {mismatch && (
          <p className="matrix-flag" role="status">
            The server returned {priority}, but this pairing should give{" "}
            {expected}. Known backend bug — <code>priorityTool.js</code>{" "}
            compares capitalised levels against lowercase ones.
          </p>
        )}
      </div>
    </div>
  );
}
