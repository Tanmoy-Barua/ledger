import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthLabel, shiftMonth } from "@/lib/money";
import { Button } from "@/components/ui/button";

export function MonthNav({ month }: { month: string }) {
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" render={<Link href={`/?month=${prev}`} />} aria-label="Previous month">
        <ChevronLeft />
      </Button>
      <p className="min-w-40 text-center text-sm font-medium sm:min-w-48 sm:text-base">
        {formatMonthLabel(month)}
      </p>
      <Button variant="outline" size="icon" render={<Link href={`/?month=${next}`} />} aria-label="Next month">
        <ChevronRight />
      </Button>
    </div>
  );
}
