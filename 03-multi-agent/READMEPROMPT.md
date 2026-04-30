# Multi-Agents

Prompt this to spin up multiple agents in parallel

```
In 03-multi-agent folder:

/multitask

Build a personal finance tracker app with this stack:
React + Tailwind, Express + Node, PostgreSQL, JWT auth

Features:
- Auth (register, login, logout)
- Dashboard (income, expenses, net balance cards, pie chart)
- Transactions (add, edit, delete, search, paginate, export CSV)

Split into parallel workstreams, each output to isolated paths:
- Database schema + migrations → /db
- Auth backend routes + JWT middleware → /server/auth
- Transaction backend routes → /server/transactions
- React auth pages (login, register) → /client/auth
- React dashboard (cards, pie chart) → /client/dashboard
- React transaction list (table, search, pagination) → /client/transactions
- CSV export feature → /client/export

Shared types file must be created first → /shared/types/index.ts
Do not start parallel work until shared types exist.
```