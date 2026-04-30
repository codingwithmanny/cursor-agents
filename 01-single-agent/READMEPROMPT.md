# Single Agent Prompts

Expect more prompts than these.

## Prompt 1 - Schema + DB

```
In the 01-single-agent folder:

Create a PostgreSQL schema for a personal finance tracker. 
Tables needed:
- users (id, email, password_hash, created_at)
- transactions (id, user_id, name, category, amount, 
  type: income/expense, date, created_at)

Categories enum: food, rent, entertainment, salary, other
```

## Prompt 2 - Backend

```
Using the PostgreSQL schema just created, build an Express 
backend with these routes:

Auth: POST /register, POST /login, POST /logout
Transactions: GET /transactions (paginated), 
POST /transactions, PUT /transactions/:id, 
DELETE /transactions/:id, GET /transactions/export/csv

Use JWT for auth middleware. Bcrypt for passwords.
```

## Prompt 3 - Backend (Potential Conflict when run in Paralle)

```
Instead of Express use Hono
Make sure to use bun instead of npm
```

## Prompt 4 - Frontend

```
Build a React + Tailwind frontend that connects to the 
Express API with these views:

- Login + Register page
- Dashboard: income card, expenses card, 
  net balance card, pie chart by category
- Transaction list: search, add, edit, 
  delete, paginate, export CSV button

Use JWT token from localStorage for auth.
```