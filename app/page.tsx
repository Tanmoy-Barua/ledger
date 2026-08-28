import type { ReactNode } from "react";
import Link from "next/link";
import { deleteTransactionAction } from "@/app/actions";
import { AppHeader } from "@/components/app-header";
import { CategoryChart, DailyChart, TrendChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonthDashboard } from "@/lib/dashboard";
import { formatMoney, parseMonth } from "@/lib/money";
import { ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = parseMonth(params.month);
  const data = await getMonthDashboard(month);

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_0%_-10%,oklch(0.96_0.03_155),transparent_45%),radial-gradient(800px_circle_at_100%_0%,oklch(0.96_0.03_25),transparent_40%)]">
      <AppHeader month={month} />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">This month</h1>
            <p className="text-sm text-muted-foreground">
              {data.count === 0
                ? "No entries yet. Add an earning or an expense to start the charts."
                : `${data.count} ${data.count === 1 ? "entry" : "entries"} in this month.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/entry/new?type=INCOME&month=${month}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-emerald-700 text-white hover:bg-emerald-800"
              )}
            >
              Add earning
            </Link>
            <Link
              href={`/entry/new?type=EXPENSE&month=${month}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-rose-700 text-white hover:bg-rose-800"
              )}
            >
              Add expense
            </Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Earned"
            value={formatMoney(data.earned)}
            hint="Income this month"
            icon={<ArrowUpRight className="size-4 text-emerald-700" />}
          />
          <SummaryCard
            title="Spent"
            value={formatMoney(data.spent)}
            hint="Expenses this month"
            icon={<ArrowDownRight className="size-4 text-rose-700" />}
          />
          <SummaryCard
            title="Left over"
            value={formatMoney(data.net)}
            hint={data.net >= 0 ? "Saved this month" : "Overspent this month"}
            icon={<Scale className="size-4 text-sky-800" />}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily activity</CardTitle>
              <CardDescription>
                Earnings and expenses by day in {month}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyChart data={data.daily} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Where money went</CardTitle>
              <CardDescription>Expense split by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart data={data.categories} />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Six-month trend</CardTitle>
            <CardDescription>
              Compare what you earned and spent over recent months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={data.trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>Every earning and expense dated in this month</CardDescription>
          </CardHeader>
          <CardContent>
            {data.transactions.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-10 text-center">
                <p className="font-medium">Nothing recorded yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your salary, freelance income, rent, or groceries to see totals and graphs.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">{tx.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.type === "INCOME" ? "secondary" : "destructive"}
                        >
                          {tx.type === "INCOME" ? "Earning" : "Expense"}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {tx.note || "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "INCOME" ? "text-emerald-800" : "text-rose-800"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "−"}
                        {formatMoney(tx.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/entry/${tx.id}/edit`}
                            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                          >
                            Edit
                          </Link>
                          <form action={deleteTransactionAction}>
                            <input type="hidden" name="id" value={tx.id} />
                            <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-1 text-2xl">{value}</CardTitle>
        </div>
        <div className="rounded-lg bg-muted p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
