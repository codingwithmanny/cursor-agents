# Kanban Orchestration

Download the Cursor cookbook to create a visual of orchestration https://github.com/cursor/cookbook/tree/main/sdk/agent-kanban

1. Clone the agent-kanban

```bash
# FROM: ./05-kanban

git clone --filter=blob:none --sparse https://github.com/cursor/cookbook.git
cd cookbook
git sparse-checkout set sdk/agent-kanban
```

2. Install dependencies & run

```bash
cd sdk/agent-kanban

bun install

bun run dev
```

3. Create & Enter Cursor API Key

A. Visit [https://cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations)
B. Click **New API Key** and Copy new key

```bash
# Example:
crsr_123...
```

4. Enter prompts in Kanban

A. DB Schema

```
In 05-kanban folder

Create PostgreSQL schema for a personal finance tracker.

Tables:
- users (id uuid PK, email text UNIQUE, password_hash text, created_at timestamptz)
- transactions (id uuid PK, user_id uuid FK → users, name text, category text,
  amount numeric(10,2), type text CHECK (type IN ('income','expense')),
  date date, created_at timestamptz)

Categories enum: food, rent, entertainment, salary, other

Output:
- /db/migrations/001_init.sql
- /db/schema.ts (TypeScript types matching schema)

Do not build anything else. Confirm files exist before finishing.
```

B. Auth Backend

```markdown
In 05-kanban folder

Using /db/schema.ts and /db/migrations/001_init.sql, build Express auth routes.

Routes:
- POST /api/auth/register → create user, return JWT
- POST /api/auth/login    → verify password, return JWT
- POST /api/auth/logout   → invalidate token

Middleware:
- /server/middleware/auth.ts → JWT verify for protected routes

Use bcrypt for passwords, jsonwebtoken for JWT.
Output to /server/auth/
Do not touch any other files.
```

C. Transactions Backend

```markdown
In 05-kanban folder

Using /db/schema.ts and /db/migrations/001_init.sql, build Express transaction routes.

Routes (all protected by JWT middleware from /server/middleware/auth.ts):
- GET    /api/transactions          → paginated (10/page), query: ?page=1&search=&category=
- POST   /api/transactions          → create transaction
- PUT    /api/transactions/:id      → update transaction
- DELETE /api/transactions/:id      → delete transaction
- GET    /api/transactions/export/csv → download all as CSV

Output to /server/transactions/
Do not touch auth files.
```

D. Auth Frontend

```markdown
In 05-kanban folder

Build React + Tailwind auth pages.

Pages:
- /login    → email + password form → POST /api/auth/login
             → store JWT in localStorage → redirect /dashboard
- /register → email + password + confirm form
             → POST /api/auth/register → redirect /login

Add protected route wrapper: if no JWT in localStorage → redirect /login

Output to /client/auth/
Use React Router for navigation. Do not build dashboard.
```

E. Dashboard

```markdown
In 05-kanban folder

Build React + Tailwind dashboard at /dashboard route.

Components:
- Summary cards row: Total Income, Total Expenses, Net Balance
  (fetch from GET /api/transactions, compute client-side)
- Expense pie chart by category using recharts
- Sign Out button → clear localStorage JWT → redirect /login

Fetch data with JWT from localStorage in Authorization header.
Output to /client/dashboard/
Do not modify auth files or transaction list.
```

F. Transaction List

```markdown
In 05-kanban folder

Build React + Tailwind transaction list at /transactions route.

Features:
- Table columns: Name, Category, Amount, Date, Edit, Delete
- Search input filters by name and category (client-side)
- Pagination: 10 per page, Prev/Next, "Showing X-Y of Z"
- Add Transaction modal: name, category (dropdown), amount,
  date, type toggle (income/expense)
- Export CSV button → GET /api/transactions/export/csv → trigger download

Fetch with JWT from localStorage.
Output to /client/transactions/
Do not modify dashboard or auth files.
```
