import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTransactionAction } from "@/app/actions";
import { AppHeader } from "@/components/app-header";
import { EntryForm } from "@/components/entry-form";
import { getTransaction } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getTransaction(id);
  if (!entry) notFound();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-10">
        <div>
          <Link href="/entries" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to monthly entries
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Edit entry</h1>
        </div>
        <EntryForm
          action={updateTransactionAction}
          initial={entry}
          defaultDate={entry.date}
          submitLabel="Save changes"
        />
      </main>
    </div>
  );
}
