---
name: duplicating-existing-code
status: draft
evidence: Fallout #597, #661, #663
---

# Duplicating existing code or dependencies

## What it looks like
A hand-written parser next to an existing utility that does the same job. Two libraries added for overlapping purposes. A private helper wrapping something a framework method already does.

## Why it is a problem
More code to maintain, with different bugs in each copy.

## Instead
Search the repo and its dependencies first. Reuse or extend what exists. Pick one library per job.
