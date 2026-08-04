import type { Level, Priority, TicketCategory } from "../types/ticket";

/**
 * The API speaks snake_case and lowercase. People don't.
 * Every value the server can send has a display label here, so nothing
 * raw ever reaches the screen.
 */

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  account_access: "Account access",
  technical_issue: "Technical issue",
  billing: "Billing",
  product_question: "Product question",
  security: "Security",
  service_outage: "Service outage",
  other: "Other",
};

export const LEVEL_LABEL: Record<Level, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/** Response target per priority, for explaining the calculation. */
export const PRIORITY_SLA: Record<Priority, string> = {
  P1: "4 Hours",
  P2: "8 Hours",
  P3: "24 Hours",
  P4: "48 Hours",
};

/**
 * Guard against a value the types didn't predict — an unreleased category,
 * a typo, a contract change nobody announced. Show it rather than crash,
 * but make it obviously unmapped.
 */
export function categoryLabel(value: string): string {
  return (
    CATEGORY_LABEL[value as TicketCategory] ??
    value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

export function levelLabel(value: string): string {
  return LEVEL_LABEL[value as Level] ?? value;
}
