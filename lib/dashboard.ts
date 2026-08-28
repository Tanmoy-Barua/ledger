import { prisma } from "@/lib/prisma";
import { monthBounds, shiftMonth, toNumber } from "@/lib/money";
import type { TxType } from "@/generated/prisma/client";

export type LedgerTransaction = {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export async function getMonthDashboard(month: string) {
  const { start, end } = monthBounds(month);
  const sixStart = monthBounds(shiftMonth(month, -5)).start;

  const [monthRows, trendRows] = await Promise.all([
    prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    prisma.transaction.findMany({
      where: { date: { gte: sixStart, lt: end } },
      select: { type: true, amount: true, date: true },
    }),
  ]);

  const transactions: LedgerTransaction[] = monthRows.map((row) => ({
    id: row.id,
    type: row.type,
    amount: toNumber(row.amount),
    category: row.category,
    note: row.note,
    date: row.date.toISOString().slice(0, 10),
  }));

  const earned = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const spent = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const daysInMonth = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)
  ).getUTCDate();

  const dailyMap = new Map<string, { income: number; expense: number }>();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${month}-${String(day).padStart(2, "0")}`;
    dailyMap.set(key, { income: 0, expense: 0 });
  }
  for (const tx of transactions) {
    const bucket = dailyMap.get(tx.date);
    if (!bucket) continue;
    if (tx.type === "INCOME") bucket.income += tx.amount;
    else bucket.expense += tx.amount;
  }

  const categoryMap = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== "EXPENSE") continue;
    categoryMap.set(tx.category, (categoryMap.get(tx.category) ?? 0) + tx.amount);
  }

  const trendMap = new Map<string, { income: number; expense: number }>();
  for (let i = 5; i >= 0; i -= 1) {
    trendMap.set(shiftMonth(month, -i), { income: 0, expense: 0 });
  }
  for (const row of trendRows) {
    const key = row.date.toISOString().slice(0, 7);
    const bucket = trendMap.get(key);
    if (!bucket) continue;
    const amount = toNumber(row.amount);
    if (row.type === "INCOME") bucket.income += amount;
    else bucket.expense += amount;
  }

  return {
    month,
    earned,
    spent,
    net: earned - spent,
    count: transactions.length,
    transactions,
    daily: [...dailyMap.entries()].map(([date, values]) => ({
      date,
      day: Number(date.slice(-2)),
      ...values,
    })),
    categories: [...categoryMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    trend: [...trendMap.entries()].map(([key, values]) => ({
      month: key,
      label: new Date(`${key}-01T00:00:00.000Z`).toLocaleDateString("en-IN", {
        month: "short",
        timeZone: "UTC",
      }),
      ...values,
    })),
  };
}
