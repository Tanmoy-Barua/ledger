import Link from "next/link";
import { createTransactionAction } from "@/app/actions";
import { EntryForm } from "@/components/entry-form";
import { parseMonth } from "@/lib/money";

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; month?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "EXPENSE" ? "EXPENSE" : "INCOME";
  const month = parseMonth(params.month);
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = today.startsWith(month) ? today : `${month}-01`;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-10">
      <div>
        <Link href={`/?month=${month}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to ledger
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {type === "INCOME" ? "Add earning" : "Add expense"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This is saved to the live database and counted in the month of the date you pick.
        </p>
      </div>
      <EntryForm
        action={createTransactionAction}
        defaultType={type}
        defaultDate={defaultDate}
        submitLabel="Save entry"
      />
    </main>
  );
}
