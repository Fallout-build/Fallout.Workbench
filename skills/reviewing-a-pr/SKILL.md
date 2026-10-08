---
name: reviewing-a-pr
status: draft
description: >-
  Review a GitHub pull request: fetch it, check claims against the code,
  reproduce anything you call blocking, then draft inline comments for the user
  to approve before posting. Use when asked to review, look at, or give
  feedback on a PR. Adds the procedure and output format only; for general
  code-quality checks use your code-review skill.
---

# Reviewing a PR

Follow `plain-english` for every comment. Do not post anything until the user
says go for that PR.

## Steps

1. **Fetch the PR.**
   ```
   gh pr view <N> --json title,body,headRefOid,files,labels,reviews,comments
   gh pr diff <N>
   ```
   Save the diff to the scratchpad. Read the PR body first. It states the
   intent and what the author tested.

2. **Read beyond the diff.** Open the callers and helpers the diff touches.
   Check the PR's claims against the base branch, not against the PR's own
   description.

3. **Reproduce before you call something blocking.**
   - Work in a throwaway worktree in the scratchpad, at the PR head:
     `git fetch origin pull/<N>/head:pr-<N>-review`.
   - Add a temporary test that shows the problem, and run it.
   - If the PR pins a tool version you do not have, change the pin in the
     scratch copy only.
   - Remove the worktree and the branch when done.
   - Never touch the main checkout.

4. **Probe edge cases** for any change that parses or rewrites text: CRLF line
   endings, tabs, single-line input, input that is already converted, and names
   that sit inside other names. A probe that finds nothing is worth one line in
   the review: "Probed X, all valid."

5. **Draft first.** Show the user each inline comment with its file path and
   line number at the head SHA. Post only after they say go.

6. **Post as one review.**
   ```
   gh api repos/<owner>/<repo>/pulls/<N>/reviews --input review.json
   ```
   The JSON holds `commit_id`, `event`, `body` and
   `comments[{path, line, side: "RIGHT", body}]`. Each line must sit inside a
   diff hunk, or the API rejects the review. Build the JSON with a script, not
   by hand.

## Verdict

- `REQUEST_CHANGES` only when something is blocking and you reproduced it.
- Otherwise `APPROVE` with comments.

The review body is 3 to 4 lines: the verdict, which comments to fix before
merge, and which are optional.

## Comment shape

- Open the review by naming what is good, briefly. Keep the tone friendly.
- Lead with the point. Then give a concrete input that shows it, the cause in
  one line, and a `Suggestion:`.
- Prefix small style points with `nit:`. Prefix open design questions with
  `Question:`. A comment with no prefix is a real finding.
- Say how you checked each claim: "reproduced", "I probed X", or "from reading
  the code". Do not state unchecked things as fact.
- Mention missing labels or draft status at most once, in the summary. A
  maintainer may add them.
