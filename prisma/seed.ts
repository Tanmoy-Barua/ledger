import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TxType } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type SeedTx = {
  type: TxType;
  amount: number;
  category: string;
  note: string;
  date: string;
};

function d(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function main() {
  const count = await prisma.transaction.count();
  if (count > 0) {
    console.log(`Seed skipped — ${count} transactions already exist.`);
    return;
  }

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const prev = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  const older = m <= 2 ? { y: y - 1, m: m + 10 } : { y, m: m - 2 };

  const rows: SeedTx[] = [
    { type: "INCOME", amount: 85000, category: "Salary", note: "Monthly salary", date: d(y, m, 1) },
    { type: "INCOME", amount: 12000, category: "Freelance", note: "Weekend project", date: d(y, m, 12) },
    { type: "EXPENSE", amount: 22000, category: "Rent", note: "Apartment rent", date: d(y, m, 2) },
    { type: "EXPENSE", amount: 4200, category: "Food", note: "Groceries", date: d(y, m, 5) },
    { type: "EXPENSE", amount: 1850, category: "Transport", note: "Metro + fuel", date: d(y, m, 8) },
    { type: "EXPENSE", amount: 3100, category: "Utilities", note: "Electricity + wifi", date: d(y, m, 10) },
    { type: "EXPENSE", amount: 2499, category: "Shopping", note: "Household items", date: d(y, m, 15) },
    { type: "EXPENSE", amount: 1200, category: "Entertainment", note: "Movie night", date: d(y, m, 18) },
    { type: "EXPENSE", amount: 900, category: "Health", note: "Pharmacy", date: d(y, m, 21) },
    { type: "EXPENSE", amount: 3500, category: "Family", note: "Parents", date: d(y, m, 24) },
    { type: "INCOME", amount: 85000, category: "Salary", note: "Monthly salary", date: d(prev.y, prev.m, 1) },
    { type: "EXPENSE", amount: 22000, category: "Rent", note: "Apartment rent", date: d(prev.y, prev.m, 3) },
    { type: "EXPENSE", amount: 5100, category: "Food", note: "Groceries", date: d(prev.y, prev.m, 11) },
    { type: "EXPENSE", amount: 1600, category: "Transport", note: "Commute", date: d(prev.y, prev.m, 16) },
    { type: "INCOME", amount: 85000, category: "Salary", note: "Monthly salary", date: d(older.y, older.m, 1) },
    { type: "EXPENSE", amount: 22000, category: "Rent", note: "Apartment rent", date: d(older.y, older.m, 2) },
    { type: "EXPENSE", amount: 3800, category: "Food", note: "Groceries", date: d(older.y, older.m, 9) },
  ];

  await prisma.transaction.createMany({
    data: rows.map((row) => ({
      ...row,
      date: new Date(`${row.date}T00:00:00.000Z`),
    })),
  });

  console.log(`Seeded ${rows.length} sample transactions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
