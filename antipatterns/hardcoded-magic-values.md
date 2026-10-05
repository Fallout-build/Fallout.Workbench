---
name: hardcoded-magic-values
status: draft
evidence: Fallout #476, #509, #531, #581
---

# Hard-coded values that should be derived or centralised

## What it looks like
Package IDs, target frameworks and version numbers typed as string literals in many places. A version nobody has bumped in years.

## Why it is a problem
Every change means a hunt across the code. Stale values ship silently.

## Instead
Read the value from its source, such as a project property. If that is impossible, define one named constant in a central place and reference it. Do a dedicated cleanup PR if the change is too wide for the current one.
