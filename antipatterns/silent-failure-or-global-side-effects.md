---
name: silent-failure-or-global-side-effects
status: draft
evidence: Fallout #433, #519, #629, #663
---

# Silent failure and hidden global side effects

## What it looks like
Code that quietly returns nothing when input is missing. Parsing code that throws `IndexOutOfRange` on malformed input. A DI registration method that changes process-wide state on every call.

## Why it is a problem
Failures surface far from their cause. Registration order and repeat calls change behaviour.

## Instead
Skip when it is safe, but log a warning that says what was skipped and why. Handle malformed input without crashing. Keep registration methods idempotent and free of global mutation.
