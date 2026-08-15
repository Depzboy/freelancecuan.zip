/**
 * Indonesian Rupiah and number formatting helpers.
 * Uses the id-ID locale: thousands separated by ".", decimals by ",".
 */

/** Format a bigint/number/string amount as Indonesian Rupiah, e.g. 75000 -> "Rp 75.000". */
export function formatRupiah(
  amount: bigint | number | string | null | undefined,
): string {
  if (amount === null || amount === undefined) return "Rp 0";
  const value = typeof amount === "bigint" ? Number(amount) : Number(amount);
  if (Number.isNaN(value)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a bare number with id-ID grouping (no currency symbol). */
export function formatNumber(
  amount: bigint | number | string | null | undefined,
): string {
  if (amount === null || amount === undefined) return "0";
  const value = typeof amount === "bigint" ? Number(amount) : Number(amount);
  if (Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("id-ID").format(value);
}

/** Format a nanosecond Timestamp (IC epoch) as a localized id-ID date string. */
export function formatTimestamp(ns: bigint | number): string {
  const ms =
    typeof ns === "bigint" ? Number(ns / 1_000_000n) : Number(ns) / 1_000_000;
  if (Number.isNaN(ms)) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
}

/** Format a nanosecond Timestamp as a localized id-ID date + time string. */
export function formatDateTime(ns: bigint | number): string {
  const ms =
    typeof ns === "bigint" ? Number(ns / 1_000_000n) : Number(ns) / 1_000_000;
  if (Number.isNaN(ms)) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

/** Shorten a principal string for display, e.g. "abcd...wxyz". */
export function shortPrincipal(
  principal: string | undefined,
  head = 6,
  tail = 4,
): string {
  if (!principal) return "-";
  if (principal.length <= head + tail + 1) return principal;
  return `${principal.slice(0, head)}…${principal.slice(-tail)}`;
}
