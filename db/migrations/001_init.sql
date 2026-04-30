-- Personal finance tracker: initial schema

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('food', 'rent', 'entertainment', 'salary', 'other')
  ),
  amount numeric(10, 2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX transactions_user_id_idx ON transactions (user_id);
CREATE INDEX transactions_user_id_date_idx ON transactions (user_id, date DESC);
