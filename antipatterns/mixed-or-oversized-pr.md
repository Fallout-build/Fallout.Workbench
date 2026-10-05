---
name: mixed-or-oversized-pr
status: draft
evidence: Fallout #393, #535, #610
---

# Mixed or oversized PR

## What it looks like
A PR that bundles a feature with a repo-wide reformat or visibility change, or carries rework commits and an unrelated commit side by side.

## Why it is a problem
Reviewers cannot see the real change. A reformat can hide two lines of logic in hundreds of changed lines.

## Instead
Keep one concern per PR. Put reformatting and cleanup in a separate PR. Squash rework into the commit it fixes, or split the PR. See the `restructure-pr-commits` skill.
