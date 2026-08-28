import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthLabel, shiftMonth } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MonthNav({ month }: { month: string }) {
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/?month=${prev}`}
        aria-label="Previous month"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
      >
        <ChevronLeft />
      </Link>
      <p className="min-w-40 text-center text-sm font-medium sm:min-w-48 sm:text-base">
        {formatMonthLabel(month)}
      </p>
      <Link
        href={`/?month=${next}`}
        aria-label="Next month"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
      >
        <ChevronRight />
      </Link>
    </div>
  );
}
