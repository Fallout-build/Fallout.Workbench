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

5. **Draft first.** Show the user:
   - each inline comment, with its file path and line number at the head SHA;
   - the label changes you propose (see Labels);
   - the assignees you propose (see Assignees).

   Post and edit only after they say go for that PR.

6. **Post as one review.**
   ```
   gh api repos/<owner>/<repo>/pulls/<N>/reviews --input review.json
   ```
   The JSON holds `commit_id`, `event`, `body` and
   `comments[{path, line, side: "RIGHT", body}]`. Each line must sit inside a
   diff hunk, or the API rejects the review. Build the JSON with a script, not
   by hand.

7. **Set labels and assignees**, after the review is posted. See below.

## Labels

Labels drive the workflow, so check them on every review.

- Read the repo's contributing guide for which labels a PR needs.
- List what exists with `gh label list`. Never invent a label.
- Compare with the PR's current labels. Propose what to add and what to
  remove, each with a one-line reason.
- Apply after the user says go:
  ```
  gh pr edit <N> --add-label "<a>,<b>" --remove-label "<c>"
  ```

## Assignees

Assign everyone involved in the review: the author or authors, and the
reviewer or reviewers.

- Authors: the PR author, plus the author of each commit. Skip bots.
  ```
  gh pr view <N> --json author,commits \
    --jq '[.author.login, (.commits[].authors[].login)] | unique[]'
  ```
- Reviewers: the user, plus anyone whose review is already requested.
  `@me` means the user.
- GitHub only accepts assignees who can be assigned in that repo. Check with
  `gh api repos/<owner>/<repo>/assignees/<login>`. Report any login that
  fails. Do not retry it.
- Apply after the user says go:
  ```
  gh pr edit <N> --add-assignee "<login>,@me"
  ```

## Verdict

- `REQUEST_CHANGES` only when something is blocking and you reproduced it.
- Otherwise `APPROVE` with comments.

The review body is 3 to 4 lines: the verdict, which comments to fix before
merge, and which are optional.

## Comment shape

- Open the review by naming what is good, briefly. Keep the tone friendly.
- Lead with the point. Then give a concrete input that shows it, the cause in
  one line, and a `Suggestion:`.
- Prefix small style points with `⛏️ nit:` (the pickaxe emoji). Prefix open
  design questions with `Question:`. A comment with no prefix is a real
  finding.
- Say how you checked each claim: "reproduced", "I probed X", or "from reading
  the code". Do not state unchecked things as fact.
- Mention the label and draft-status changes once, in the review body.
