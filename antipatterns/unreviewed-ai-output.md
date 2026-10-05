---
name: unreviewed-ai-output
status: draft
evidence: Fallout #528, #538, #559, #576, #581, #637
---

# Unreviewed AI output

## What it looks like
Cryptic AI-written PR descriptions. Changes that go further than the task asked. Docs, ADRs and convention files that are long and convoluted. Tests with creative private helpers. Documents kept only because an agent might want them.

## Why it is a problem
The author cannot explain the change. Reviewers lose time decoding it. Extra files mislead both people and agents into maintaining things nobody needs.

## Instead
Read and understand every line before you open the PR. Keep scope to what was asked. Write the PR description yourself in plain English. Delete files that no longer earn their place. Fix the instruction file when an agent keeps making the same mistake.
