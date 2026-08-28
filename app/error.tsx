"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-xl font-semibold">Could not load the ledger</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "The database may be unreachable. Check DATABASE_URL and try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white"
      >
        Try again
      </button>
    </main>
  );
}
