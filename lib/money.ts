export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "INR";
export const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "en-IN";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function monthKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseMonth(value: string | undefined) {
  const now = new Date();
  const fallback = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return fallback;
  return value;
}

export function monthBounds(month: string) {
  const [year, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, m - 1, 1));
  const end = new Date(Date.UTC(year, m, 1));
  return { start, end };
}

export function shiftMonth(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + delta, 1));
  return monthKey(date);
}

export function formatMonthLabel(month: string) {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString(LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function toNumber(value: { toString(): string } | number | string) {
  return typeof value === "number" ? value : Number(value);
}
