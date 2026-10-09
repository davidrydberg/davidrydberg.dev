---
status: accepted
date: 2026-10-09
---

# Generate Showcase Builds from the public daily logs

ADR 0001 kept Build Logs hand-written, because GitHub activity from private repos degrades to commit counts.
Since 2026-10-07 the private repo davidrydberg/logs holds a daily summary of what David built, with the mechanism, what broke and how agents were used.
Most of that work is client work and never reached the Portal, because nobody wrote it up by hand.
David wants the Portal to show what he builds from that source, and no client may be named.

## Decision

- The logs repo writes a public version of every day to `public/`: clients anonymised, client data, links, client code names and security detail removed. A day that still contains a banned term or a URL is not written.
- `scripts/showcase.sh` reads only `public/`, has Claude create or update Showcase Builds (`source: logs`), and opens a PR. One Build is one thing built, never one per repo or per day. Routine work is left out.
- The script refuses a result that touches anything but Showcase Builds, edits a hand-written Build, or contains a banned term. The banned terms live in the private logs repo, so this public repo never lists them.
- David merges the PR. Nothing is published without that.
- Hand-written Builds stay as they are, and projects with a hand-written Build get no Showcase Build.

## Considered options

- A daily feed page built from the logs. Rejected: most days are routine fixes, so it reads as an activity feed, not a showcase.
- Anonymising at site build time with a model. Rejected: every deploy would depend on a model, and the output could change between builds.
- Publishing without review. Rejected: a missed client detail is public the moment it deploys.

## Consequences

- Supersedes the "Build Logs are hand-written" consequence of ADR 0001 for Showcase Builds only.
- Showcase Builds anonymise every client, including the ones the Portal may name.
- The privacy of client work depends on two model passes, two banned-term checks and David's review of each PR.
