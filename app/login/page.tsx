import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(1200px_circle_at_10%_-10%,oklch(0.95_0.04_155),transparent_50%),radial-gradient(900px_circle_at_110%_10%,oklch(0.95_0.04_25),transparent_45%)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Ledger</p>
            <p className="text-sm text-muted-foreground">
              Private monthly money tracker
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          There is no public sign-up. Use the email and password provided for
          this app.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            Email or password is incorrect.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="you@example.com"
              className="h-10"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-10"
            />
          </div>
          <Button type="submit" size="lg" className="mt-2 w-full bg-emerald-700 text-white hover:bg-emerald-800">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
