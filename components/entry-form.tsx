import { categoriesFor } from "@/lib/categories";
import type { LedgerTransaction } from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: LedgerTransaction;
  defaultType?: "INCOME" | "EXPENSE";
  defaultDate: string;
  submitLabel: string;
};

export function EntryForm({
  action,
  initial,
  defaultType = "INCOME",
  defaultDate,
  submitLabel,
}: Props) {
  const type = initial?.type ?? defaultType;
  const categories = categoriesFor(type);

  return (
    <form action={action} className="grid gap-4">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Type</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-50">
            <input
              type="radio"
              name="type"
              value="INCOME"
              defaultChecked={type === "INCOME"}
              required
            />
            Earning
          </label>
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm has-[:checked]:border-rose-700 has-[:checked]:bg-rose-50">
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              defaultChecked={type === "EXPENSE"}
              required
            />
            Expense
          </label>
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
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
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue={initial?.category ?? categories[0]}
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <optgroup label="Earnings">
            {categoriesFor("INCOME").map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </optgroup>
          <optgroup label="Expenses">
            {categoriesFor("EXPENSE").map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </optgroup>
        </select>
        <p className="text-xs text-muted-foreground">
          Pick a category that matches the type above.
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={initial?.date ?? defaultDate}
          className="h-10"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          name="note"
          defaultValue={initial?.note ?? ""}
          placeholder="Optional"
          className="h-10"
        />
      </div>

      <Button type="submit" size="lg" className="bg-emerald-700 text-white hover:bg-emerald-800">
        {submitLabel}
      </Button>
    </form>
  );
}
