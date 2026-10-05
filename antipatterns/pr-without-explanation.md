---
name: pr-without-explanation
status: draft
evidence: Fallout #425, #450, #478, #580
---

# PR without an explanation

## What it looks like
A description that links an issue but does not say what the change does or why. No tests, with no reason given. Unrelated edits with no comment.

## Why it is a problem
Reviewers have to guess the intent, so the first round of review is spent asking questions.

## Instead
State the problem, the change and how you checked it. Add tests, or say why not. Explain each unrelated edit or move it to another PR. See the `plain-english` skill.
