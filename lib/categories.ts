export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Interest",
  "Gift",
  "Refund",
  "Other income",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Family",
  "Other expense",
] as const;

export function categoriesFor(type: "INCOME" | "EXPENSE") {
  return type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
