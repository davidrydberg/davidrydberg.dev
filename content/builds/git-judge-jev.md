---
title: git-judge-jev
oneliner: A GitHub Action that tells the reviewer where to look, and when a PR's story does not match its diff
started: 2026-09-18
links:
  - label: repo
    url: https://github.com/davidrydberg/git-judge-jev
---

## Why

Code review is now the bottleneck, and more and more of the code being reviewed is written by agents.
A typical agent-written PR is 30 files, and a handful of them hold the actual change.
The reviewer opens the Files tab, does not know where to start, and postpones.
Agents also make failing tests pass by loosening the assertion, and write descriptions that do not match what they changed.
Review bots that run a model over every hunk leave 30 comments of equal weight, and people stop reading them.

So git-judge-jev reads every hunk, sets the mechanical ones aside, and posts one comment: what the PR really does, the few hunks that need a human, and what to verify in each.
It does not find logic bugs and it does not suggest code.

## Stack

TypeScript GitHub Action, bundled to one committed file.
TypeSafe's Jev model answers yes/no questions about every hunk with calibrated probabilities.
Plain code turns those answers into a reading order, flags, labels and the check.
Only flagged hunks go to a generative model, GPT-5.6 Luna by default, which confirms or drops each flag and writes the text.
An eval harness of labelled PRs, with every model answer cached, measures each change to the judge.
Runs on its own pull requests.
Written with Claude Code.

## Log

2026-09-18 10:01 TRIED Started as readfirst, from a PRD. Diff, questions, judge and policy stages first. One hunk per Jev request, since it loses accuracy when unrelated code shares the call.
2026-09-18 10:16 WORKS Whole pipeline runs end to end on a real git diff: judge, writer, report, GitHub. The policy is read from the base branch, so a PR cannot loosen the rules it is judged by.
2026-09-18 10:29 BROKE First live run. My token estimate was 0.70x of what TypeSafe billed: every request carries about 270 tokens of overhead I had not counted.
2026-09-18 10:36 NOTE Renamed readfirst to git-judge, to match the repo.
2026-09-18 10:42 BROKE Jev says every feature and bugfix changes behaviour, at 0.95. That put three ordinary hunks above the one real finding. It now only counts inside a refactor.
2026-09-18 10:43 BROKE One unannounced rename produced 18 identical "not in the description" comments. That flag now gets one line in the summary.
2026-09-18 10:49 BROKE Inline review comments read as spam on a live PR: a review and a notification on every push. Dropped them. One comment, updated in place, is the whole report.
2026-09-18 10:57 WORKS Every raw Jev answer goes into a collapsed table in the comment, so thresholds can be tuned from real PRs instead of guessed.
2026-09-18 16:41 WORKS Findings get stable ids and name the commit they judged, so another agent can read the report. A run whose PR moved on posts nothing.
2026-09-18 17:13 BROKE A test snapshot that quoted an auth path was ranked first as auth code. Snapshots are now skipped like generated files.
2026-09-18 17:21 WORKS A finding shows the code it is about. The model only points at lines, the text shown comes from the diff, so no code the model wrote reaches the comment.
2026-09-19 06:23 BROKE Caught that a hunk with a possible secret could still reach the writer model through a second flag, which could quote the secret. Closed.
2026-09-19 06:53 WORKS Eval harness: labelled PRs with planted defects, run through the real pipeline, every model answer cached. A threshold change now costs nothing to test.
2026-09-19 06:59 WORKS Measured with the eval, must-read hunks in the top 5 went from 70% to 90%, precision unchanged at 86%. Renamed to git-judge-jev: Jev is the recall stage, the writer model is the precision stage.
2026-09-19 06:59 TRIED A weight for untested production code. Moved nothing in the eval, so it is gone.
