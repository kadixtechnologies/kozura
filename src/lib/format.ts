/**
 * Format a number as Nigerian Naira.
 * Used across product cards, order summaries, dashboards, etc.
 */
export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
