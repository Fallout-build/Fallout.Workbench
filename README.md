# Fallout.Workbench

Shared patterns, antipatterns, skills and agents for the Fallout-build organisation. The goal is to standardise how we work, with and without AI tools.

> **Status: early.** Everything starts as `draft`. Items move to `trial` and then `standard` once they have survived real use.

## Install (Claude Code)

```
/plugin marketplace add Fallout-build/Fallout.Workbench
/plugin install fallout-workbench@fallout-workbench
```

Other tools (such as GitHub Copilot) read [`AGENTS.md`](AGENTS.md) and can use the files under `skills/`, `patterns/` and `antipatterns/` directly.

## What is in here

| Folder | Contents |
|---|---|
| `patterns/` | How we do things |
| `antipatterns/` | What we reject, and why (11 drafts so far) |
| `skills/` | `plain-english`, `restructure-pr-commits`, `reviewing-a-pr` |
| `agents/` | `story-writer` |
| `commands/` | `new-issue` |
| `templates/` | Starter files for other repos |

See [CONTRIBUTING.md](CONTRIBUTING.md) to add or change something.
