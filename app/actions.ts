"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  credentialsMatch,
  destroySession,
  requireSession,
} from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { categoriesFor } from "@/lib/categories";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!credentialsMatch(email, password)) {
    redirect("/login?error=1");
  }

  await createSession();
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

function parseTransaction(formData: FormData) {
  const type = String(formData.get("type") ?? "");
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const date = String(formData.get("date") ?? "");

  if (type !== "INCOME" && type !== "EXPENSE") {
    throw new Error("Choose earning or expense");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter an amount greater than zero");
  }
  if (!categoriesFor(type).includes(category as never)) {
    throw new Error("Pick a valid category");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Pick a valid date");
  }

  return {
    type: type as "INCOME" | "EXPENSE",
    amount,
    category,
    note,
    date: new Date(`${date}T00:00:00.000Z`),
  };
}

function monthQuery(date: Date) {
  return `/entries?month=${date.toISOString().slice(0, 7)}`;
}

export async function createTransactionAction(formData: FormData) {
  await requireSession();
  const data = parseTransaction(formData);
  await getPrisma().transaction.create({ data });
  revalidatePath("/");
  revalidatePath("/entries");
  redirect(monthQuery(data.date));
}

export async function updateTransactionAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing transaction");
  const data = parseTransaction(formData);
  await getPrisma().transaction.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/entries");
  redirect(monthQuery(data.date));
}

export async function deleteTransactionAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing transaction");
  const existing = await getPrisma().transaction.findUnique({ where: { id } });
  await getPrisma().transaction.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/entries");
  redirect(existing ? monthQuery(existing.date) : "/entries");
}
