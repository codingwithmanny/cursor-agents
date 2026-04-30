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

4. Update Environment Variables

```bash
# FROM: ./05-kanban

cp .env.example .env
```

File: `.env`

```bash
REPO_URL=https://github.com/YOUR-GITHUB-USER/REPO-NAME
CURSOR_API_KEY=YOUR_CURSOR_API_KEY
```

5. Run Seed

```bash
# FROM: ./05-kanban

bun install;

bun run dev;
```

