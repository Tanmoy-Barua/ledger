"use client";

import { toast } from "sonner";
import { deleteTransactionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async (formData) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
          await deleteTransactionAction(formData);
          toast.success("Entry deleted");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not delete");
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" className="text-destructive">
        Delete
      </Button>
    </form>
  );
}
