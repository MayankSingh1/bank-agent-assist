export { cn } from "cn";

export const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/** "2026-10-03" → "Oct 3". Dates are calendar dates, so format in UTC to avoid an off-by-one. */
export const shortDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export const daysAgo = (n: number) => (n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n} days ago`);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
