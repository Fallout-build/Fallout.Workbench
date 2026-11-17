# Fallout.Workbench

Shared patterns, antipatterns, skills and agents for the Fallout-build organisation. The goal is to standardise how we work, with and without AI tools.

> **Status: early.** Everything starts as `draft`. Items move to `trial` and then `standard` once they have survived real use.

## Install (Claude Code)

```
/plugin marketplace add Fallout-build/Fallout.Workbench
/plugin install fallout-workbench@fallout-workbench
```

To work on the core repo (`Fallout-build/Fallout`), also install its skills:

```
/plugin install fallout-core@fallout-workbench
```

Other tools (such as GitHub Copilot) read [`AGENTS.md`](AGENTS.md) and can use the files under `skills/`, `patterns/` and `antipatterns/` directly.

## What is in here

| Folder | Contents |
|---|---|
| `patterns/` | How we do things |
| `antipatterns/` | What we reject, and why (11 drafts so far) |
| `skills/` | `plain-english`, `restructure-pr-commits`, `reviewing-a-pr` |
| `agents/` | `story-writer`, `qa` |
| `commands/` | `new-issue` |
| `templates/` | Starter files for other repos |
| `plugins/fallout-core/` | Skills for the core repo: `creating-a-pr`, `cutting-a-release`, `editing-ci-workflows`, `marking-experimental-apis`, `adding-a-tool-wrapper`, `adding-a-migration-step` |

## Use Workbench in another repo

A repo can get a copy of the shared skills, agents and commands it wants. The copies are plain files in the repo, so every contributor and every tool has them with no install step. A scheduled workflow keeps them current and opens a PR when Workbench changes.

1. Add `workbench.json` to the root of your repo. List the items you want:

   ```json
   {
     "items": [
       "skills/plain-english",
       "skills/reviewing-a-pr",
       "agents/story-writer.md",
       "commands/new-issue.md"
     ]
   }
   ```

   Items are `skills/<name>`, `agents/<name>.md` or `commands/<name>.md`. Optional settings and their defaults:
   - `skillsDirs`: `[".agents/skills"]`. Cursor, Codex and GitHub Copilot read this folder. Claude Code reads `.claude/skills` instead, so add that folder here, or list the skills in your `CLAUDE.md`.
   - `agentsDir`: `.claude/agents`
   - `commandsDir`: `.claude/commands`

2. Add `.github/workflows/workbench-sync.yml`:

   ```yaml
   name: Sync Workbench
   on:
     schedule:
       - cron: '0 20 * * 0'
     workflow_dispatch:

   jobs:
     sync:
       uses: Fallout-build/Fallout.Workbench/.github/workflows/sync.yml@main
       permissions:
         contents: write
         pull-requests: write
       # with:
       #   labels: your-label,another-label   # labels must already exist in your repo
       #   draft: true
   ```

3. In your repo, go to Settings → Actions → General and turn on "Allow GitHub Actions to create and approve pull requests".

Notes:
- Do not edit the copies. Change them in Workbench. The sync replaces any edit.
- `workbench.lock.json` holds a hash of every copied file. From your repo, run `node <path-to-a-Workbench-checkout>/scripts/sync.mjs --target . --check` to fail when a copy was edited by hand.
- A PR opened with the default token does not start your other workflows. Close and reopen it, or use a token of your own, if you need CI to run on it.
- The sync branch is named `workbench-sync` and belongs to the workflow. Each run replaces it.
- To pin to a version, pass `workbench-ref` (a tag or commit) in `with:`.

See [CONTRIBUTING.md](CONTRIBUTING.md) to add or change something.
