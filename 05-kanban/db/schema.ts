/** Types aligned with db/migrations/001_init.sql */

export type TransactionCategory =
  | "food"
  | "rent"
  | "entertainment"
  | "salary"
  | "other";

export type TransactionType = "income" | "expense";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  category: TransactionCategory;
  /** numeric(10,2) from PostgreSQL; use string to avoid float rounding */
  amount: string;
  type: TransactionType;
  /** ISO date YYYY-MM-DD */
  date: string;
  created_at: string;
}
