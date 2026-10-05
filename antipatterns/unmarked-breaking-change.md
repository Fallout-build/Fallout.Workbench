---
name: unmarked-breaking-change
status: draft
evidence: Fallout #393, #410, #528
---

# Unmarked breaking change

## What it looks like
A public signature, namespace or behaviour change that is not labelled, not described as breaking, and has no migration path. The PR title says nothing about the break.

## Why it is a problem
Consumers find out when their build fails. Maintainers cannot tell what is safe to ship.

## Instead
Check every public change for compatibility. Label breaking changes, add a callout to the description, and name the migration path. Breaking changes wait for the next major version, or ship behind an experimental attribute.
