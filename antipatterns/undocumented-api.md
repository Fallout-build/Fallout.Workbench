---
name: undocumented-api
status: draft
evidence: Fallout #466, #478, #519, #535, #597
---

# Undocumented API or algorithm

## What it looks like
Public members without XML docs. Private helpers, regexes and multi-step algorithms with no comment on what they do or why. A comment that no longer matches the code after a change.

## Why it is a problem
Contributors must reverse-engineer intent. Missing docs on public APIs was a long-running weakness of the project we replaced.

## Instead
Document every public member: what it does, accepted inputs, and what happens on edge cases (missing directory, conflicting files). Explain non-obvious private methods and regexes. Update the comment when you change the code.
