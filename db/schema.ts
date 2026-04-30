/** Category values enforced by `transactions.category` CHECK in PostgreSQL. */
export const TRANSACTION_CATEGORIES = [
  "food",
  "rent",
  "entertainment",
  "salary",
  "other",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

/** Values enforced by `transactions.type` CHECK in PostgreSQL. */
export const TRANSACTION_TYPES = ["income", "expense"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  category: TransactionCategory;
  amount: string; // numeric(10,2) from PG; use decimal.js or similar if parsing
  type: TransactionType;
  date: string; // ISO date 'YYYY-MM-DD'
  created_at: Date;
}
