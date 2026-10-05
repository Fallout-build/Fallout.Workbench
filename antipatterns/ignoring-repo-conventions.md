---
name: ignoring-repo-conventions
status: draft
evidence: Fallout #448, #451, #486, #535, #597, #661
---

# Ignoring the repo's code conventions

## What it looks like
New code that uses `_` field prefixes, omits braces, uses `var` where the type is not visible, breaks naming or member-order rules, exceeds the line length, or skips newer language features the repo has adopted.

## Why it is a problem
Reviews fill up with style nitpicks, and the codebase stays inconsistent. Conventions that live only in someone's head are not followed.

## Instead
Put the rule in `.editorconfig` and enable the analyzers so the build reports it. Run the IDE auto-cleanup on files you touch. Read a neighbouring file before writing a new one.
