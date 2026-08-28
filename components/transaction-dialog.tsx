"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  createTransactionAction,
  updateTransactionAction,
} from "@/app/actions";
import { categoriesFor } from "@/lib/categories";
import type { LedgerTransaction } from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  mode?: "create" | "edit";
  initial?: LedgerTransaction;
  defaultType?: "INCOME" | "EXPENSE";
};

export function TransactionDialog({
  mode = "create",
  initial,
  defaultType = "INCOME",
}: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    initial?.type ?? defaultType
  );
  const [pending, setPending] = useState(false);

  const categories = useMemo(() => categoriesFor(type), [type]);
  const defaultDate =
    initial?.date ?? new Date().toISOString().slice(0, 10);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      if (mode === "edit") {
        await updateTransactionAction(formData);
        toast.success("Entry updated");
      } else {
        await createTransactionAction(formData);
        toast.success(type === "INCOME" ? "Earning added" : "Expense added");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setPending(false);
    }
  }

  const title =
    mode === "edit"
      ? "Edit entry"
      : defaultType === "INCOME"
        ? "Add earning"
        : "Add expense";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          mode === "edit" ? (
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          ) : (
            <Button
              size="lg"
              className={
                defaultType === "INCOME"
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "bg-rose-700 text-white hover:bg-rose-800"
              }
            >
              <Plus className="size-4" />
              {defaultType === "INCOME" ? "Add earning" : "Add expense"}
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Amounts are stored in your live database and counted in the month of
            the date you pick.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-3">
          {mode === "edit" ? (
            <input type="hidden" name="id" value={initial?.id} />
          ) : null}
          <input type="hidden" name="type" value={type} />

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "INCOME" ? "default" : "outline"}
              className={type === "INCOME" ? "bg-emerald-700 text-white hover:bg-emerald-800" : ""}
              onClick={() => setType("INCOME")}
            >
              Earning
            </Button>
            <Button
              type="button"
              variant={type === "EXPENSE" ? "default" : "outline"}
              className={type === "EXPENSE" ? "bg-rose-700 text-white hover:bg-rose-800" : ""}
              onClick={() => setType("EXPENSE")}
            >
              Expense
            </Button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`amount-${initial?.id ?? defaultType}`}>Amount</Label>
            <Input
              id={`amount-${initial?.id ?? defaultType}`}
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={initial?.amount ?? ""}
              placeholder="0.00"
              className="h-10"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`category-${initial?.id ?? defaultType}`}>Category</Label>
            <select
              id={`category-${initial?.id ?? defaultType}`}
              name="category"
              required
              defaultValue={initial?.category ?? categories[0]}
              key={`${type}-${initial?.id ?? "new"}`}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`date-${initial?.id ?? defaultType}`}>Date</Label>
            <Input
              id={`date-${initial?.id ?? defaultType}`}
              name="date"
              type="date"
              required
              defaultValue={defaultDate}
              className="h-10"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`note-${initial?.id ?? defaultType}`}>Note</Label>
            <Input
              id={`note-${initial?.id ?? defaultType}`}
              name="note"
              defaultValue={initial?.note ?? ""}
              placeholder="Optional"
              className="h-10"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending} size="lg">
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
