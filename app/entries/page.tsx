import Link from "next/link";
import { deleteTransactionAction } from "@/app/actions";
import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { formatMoney, formatMonthLabel, parseMonth } from "@/lib/money";
import { cn } from "@/lib/utils";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = parseMonth(params.month);
  const data = await getMonthDashboard(month);

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_circle_at_0%_-10%,oklch(0.96_0.03_155),transparent_45%),radial-gradient(800px_circle_at_100%_0%,oklch(0.96_0.03_25),transparent_40%)]">
      <AppHeader month={month} monthHrefBase="/entries" current="entries" />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {formatMonthLabel(month)} entries
            </h1>
            <p className="text-sm text-muted-foreground">
              {data.count === 0
                ? "No entries in this month yet."
                : `${data.count} ${data.count === 1 ? "entry" : "entries"} · earned ${formatMoney(data.earned)} · spent ${formatMoney(data.spent)}`}
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

        <Card>
          <CardHeader>
            <CardTitle>Monthly list</CardTitle>
            <CardDescription>
              Every earning and expense dated in {formatMonthLabel(month)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.transactions.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-10 text-center">
                <p className="font-medium">Nothing recorded yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an earning or expense for this month, or switch months with the arrows.
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
