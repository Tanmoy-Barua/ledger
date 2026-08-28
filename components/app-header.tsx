import { CircleUser, ChevronDown, LogOut, Wallet } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { MonthNav } from "@/components/month-nav";
import { buttonVariants } from "@/components/ui/button";
import { getLoginCredentials } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AppHeader({ month }: { month?: string }) {
  const { email } = getLoginCredentials();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Ledger</p>
            <p className="text-sm text-muted-foreground">
              Earnings, expenses, and the month they belong to
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {month ? <MonthNav month={month} /> : null}
          <AccountMenu email={email} />
        </div>
      </div>
    </header>
  );
}

function AccountMenu({ email }: { email: string }) {
  return (
    <details className="relative">
      <summary
        className={cn(
          buttonVariants({ variant: "outline" }),
          "cursor-pointer list-none [&::-webkit-details-marker]:hidden"
        )}
      >
        <CircleUser className="size-4" />
        Account
        <ChevronDown className="size-4 opacity-70" />
      </summary>
      <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10">
        <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">{email}</p>
        <div className="my-1 h-px bg-border" />
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
