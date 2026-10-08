# AGENTS.md

This repo holds shared standards for the Fallout-build organisation: patterns,
antipatterns, skills, agents and templates. It contains no application code.

## Layout

- `patterns/` — how we do X. One file per pattern, with an example.
- `antipatterns/` — what we reject. Each file says what is wrong, why, and shows bad and good code.
- `skills/<name>/SKILL.md` — procedural recipes an AI tool loads on demand.
- `agents/` — shared subagent definitions.
- `commands/` — shared slash commands.
- `templates/` — starter files other repos can copy.
- `plugins/<repo>/` — a separate plugin with skills for one repo, such as `plugins/fallout-core/`.

## Rules

1. Every pattern, antipattern, skill and agent starts with frontmatter that includes `status: draft | trial | standard`. New items start as `draft`.
2. Content at the top level (`skills/`, `agents/`, `commands/`, `patterns/`, `antipatterns/`) must be generic to the org. Guidance for one repo lives in its own plugin under `plugins/<repo>/`, so people who do not work on that repo never load it.
3. Write in plain English. Follow `skills/plain-english/SKILL.md`.
4. One topic, one home. Link to the canonical file instead of repeating its rules.
5. Never add private or customer-specific material. This repo is public.
