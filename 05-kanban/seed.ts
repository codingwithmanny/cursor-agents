import { Agent } from "@cursor/sdk";
import { existsSync } from "fs";
import { resolve } from "path";

const REPO    = process.env.REPO_URL;
const API_KEY = process.env.CURSOR_API_KEY!;
const BRANCH  = "main";
const LOCAL_DIR = process.env.LOCAL_DIR ?? process.cwd();

if (!API_KEY) {
  console.error("❌ Missing CURSOR_API_KEY");
  process.exit(1);
}

// Runtime mode — cloud if repo set, local otherwise
const useCloud = Boolean(REPO);

if (useCloud) {
  console.log(`☁️  Mode: Cloud  →  ${REPO}`);
} else {
  const dir = resolve(LOCAL_DIR);
  if (!existsSync(dir)) {
    console.error(`❌ LOCAL_DIR not found: ${dir}`);
    process.exit(1);
  }
  console.log(`💻 Mode: Local  →  ${dir}`);
}

// ─── Card definitions ────────────────────────────────────────────────────────

const cards = [
  {
    id: "schema",
    title: "DB Schema",
    dependsOn: [],
    prompt: `
Create PostgreSQL schema for a personal finance tracker.

Tables:
- users (id uuid PK, email text UNIQUE, password_hash text, created_at timestamptz)
- transactions (id uuid PK, user_id uuid FK → users, name text, category text,
  amount numeric(10,2), type text CHECK (type IN ('income','expense')),
  date date, created_at timestamptz)

Categories enum: food, rent, entertainment, salary, other

Output:
- /db/migrations/001_init.sql
- /db/schema.ts  (TypeScript types matching schema)

Do not build anything else. Confirm files exist before finishing.
    `.trim(),
  },
  {
    id: "auth-backend",
    title: "Auth Backend",
    dependsOn: ["schema"],
    prompt: `
Using /db/schema.ts and /db/migrations/001_init.sql, build Express auth routes.

Routes:
- POST /api/auth/register  → create user, return JWT
- POST /api/auth/login     → verify password, return JWT
- POST /api/auth/logout    → invalidate token

Middleware:
- /server/middleware/auth.ts  → JWT verify middleware for protected routes

Use bcrypt for passwords, jsonwebtoken for JWT.
Output to /server/auth/

Do not touch any other files.
    `.trim(),
  },
  {
    id: "transactions-backend",
    title: "Transactions Backend",
    dependsOn: ["schema"],
    prompt: `
Using /db/schema.ts and /db/migrations/001_init.sql, build Express transaction routes.

Routes (all protected by JWT middleware from /server/middleware/auth.ts):
- GET    /api/transactions        → paginated (10/page), query: ?page=1&search=&category=
- POST   /api/transactions        → create transaction
- PUT    /api/transactions/:id    → update transaction
- DELETE /api/transactions/:id    → delete transaction
- GET    /api/transactions/export/csv → download all as CSV

Output to /server/transactions/
Do not touch auth files.
    `.trim(),
  },
  {
    id: "auth-frontend",
    title: "Auth Frontend",
    dependsOn: ["auth-backend"],
    prompt: `
Build React + Tailwind auth pages.

Pages:
- /login    → email + password form → POST /api/auth/login → store JWT in localStorage → redirect /dashboard
- /register → email + password + confirm form → POST /api/auth/register → redirect /login

Add protected route wrapper: if no JWT in localStorage → redirect /login

Output to /client/auth/
Use React Router for navigation. Do not build dashboard.
    `.trim(),
  },
  {
    id: "dashboard",
    title: "Dashboard",
    dependsOn: ["transactions-backend", "auth-frontend"],
    prompt: `
Build React + Tailwind dashboard at /dashboard route.

Components:
- Summary cards row: Total Income, Total Expenses, Net Balance
  (fetch from GET /api/transactions, compute client-side)
- Expense pie chart by category using recharts
- Sign Out button → DELETE localStorage JWT → redirect /login

Fetch data with JWT from localStorage in Authorization header.
Output to /client/dashboard/
Do not modify auth files or transaction list.
    `.trim(),
  },
  {
    id: "transaction-list",
    title: "Transaction List",
    dependsOn: ["transactions-backend", "auth-frontend"],
    prompt: `
Build React + Tailwind transaction list at /transactions route.

Features:
- Table columns: Name, Category, Amount, Date, Edit, Delete
- Search input filters by name and category (client-side)
- Pagination: 10 per page, Prev/Next, "Showing X-Y of Z"
- Add Transaction modal: name, category (dropdown), amount, date, type toggle (income/expense)
- Export CSV button → GET /api/transactions/export/csv → trigger download

Fetch with JWT from localStorage.
Output to /client/transactions/
Do not modify dashboard or auth files.
    `.trim(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function createAndSend(card: (typeof cards)[0]): Promise<string> {
  console.log(`\n🚀 Spawning: ${card.title}`);

  const agent = await Agent.create({
    apiKey: API_KEY,
    model: { id: "composer-2" },
    ...(useCloud
      ? {
          cloud: {
            repos: [{ url: REPO!, startingRef: BRANCH }],
            autoCreatePR: true,
          },
        }
      : {
          local: { cwd: resolve(LOCAL_DIR) },
        }),
  });

  const run = await agent.send(card.prompt);
  console.log(`   ✅ ${card.title} → run: ${run.id}`);
  return run.id;
}

async function waitForRun(runId: string, title: string): Promise<void> {
  console.log(`⏳ Waiting for: ${title} (${runId})`);
  const runtime = useCloud ? "cloud" : "local";
  const run = await Agent.getRun(runId, { runtime } as any);
  await (run as any).wait();
  console.log(`✅ Done: ${title}`);
}

// ─── Orchestration ───────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding finance app kanban cards...\n");
  console.log(`   Runtime: ${useCloud ? "cloud → " + REPO : "local → " + resolve(LOCAL_DIR)}`);
  console.log(`   Cards: ${cards.length}\n`);

  const completedRuns: Record<string, string> = {}; // card.id → runId

  // Process cards in dependency order
  const remaining = [...cards];

  while (remaining.length > 0) {
    // Find cards whose deps are all done
    const ready = remaining.filter((card) =>
      card.dependsOn.every((dep) => dep in completedRuns)
    );

    if (ready.length === 0) {
      console.error("❌ Dependency deadlock — check dependsOn config");
      process.exit(1);
    }

    // Spawn all ready cards in parallel
    const spawned = await Promise.all(
      ready.map(async (card) => {
        const runId = await createAndSend(card);
        return { card, runId };
      })
    );

    // Wait for all spawned to complete before unblocking next wave
    await Promise.all(
      spawned.map(({ card, runId }) => waitForRun(runId, card.title))
    );

    // Mark completed
    for (const { card, runId } of spawned) {
      completedRuns[card.id] = runId;
      remaining.splice(remaining.indexOf(card), 1);
    }
  }

  console.log("\n🎉 All cards seeded and completed!");
  if (useCloud) console.log("   Open the kanban to review PRs.");
  else console.log(`   Check ${resolve(LOCAL_DIR)} for output files.`);
  console.log();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});