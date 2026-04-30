# Orchestration

1. Press `Cmd+Shift+P` → and type "Agents Window" (View: Switch to Agents Window)
2. Make sure to choose the location of the root folder container `04-orchestration`
2. Enter this prompt

```markdown
In 04-orchestration folder

Build a personal finance tracker app.
React + Tailwind, Express, PostgreSQL, JWT.
Figure out what needs to be built and get it done.

Built this from scratch and ignore other folders as a reference.
```

How does this differ from single agent window?

|                       | Single Agent (Plan mode) | Cursor 3 Agents Window |
| --------------------- | ------------------------ | ---------------------- |
| Agents                | 1                        | Many                   |
| Task decomposition    | You                      | Cursor                 |
| Subagent spawning     | None                     | Automatic              |
| Runs in background    | No                       | Yes (cloud)            |
| Cross-repo            | No                       | Yes                    |
| Mid-flight adaptation | No                       | Partial                |