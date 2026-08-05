/**
 * Shared date formatting so every screen renders dates identically instead
 * of each component reaching for its own `toLocaleDateString` call.
 */
export function formatDate(value, options = {}) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatDateTime(value) {
  return formatDate(value, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  const thresholds = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 2592000, divisor: 86400, unit: "day" },
    { limit: 31536000, divisor: 2592000, unit: "month" },
    { limit: Infinity, divisor: 31536000, unit: "year" },
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const { divisor, unit } =
    thresholds.find((t) => Math.abs(seconds) < t.limit) ??
    thresholds[thresholds.length - 1];

  return formatter.format(-Math.round(seconds / divisor), unit);
}
