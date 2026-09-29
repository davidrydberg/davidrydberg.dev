# Reliability target for davidrydberg.dev

Owner: SRE. Established 2026-09-29 (DAV-5). Changing the number, the SLI or the
escalation ladder needs the CTO's sign-off.

## 1. The target

| Field | Value |
| --- | --- |
| Availability target | **99.9%** of successful synthetic checks |
| Measurement window | **Rolling 30 days** |
| Error budget | **43 min 12 s** of downtime per rolling 30 days |
| Scope | `https://davidrydberg.dev/` (apex, HTTPS) only |
| Detection objective | **5 minutes** from outage start to an alert existing. **Not yet claimed**, see section 5 |
| Recovery objective (MTTR) | **15 minutes** from detection to service restored |
| Latency objective | p95 total time under 800 ms from the probe. Reviewed monthly. Never pages |

`www.davidrydberg.dev` is **out of scope** until its TLS defect (DAV-6) is
fixed. Counting a hostname we know fails 100% of the time would make the number
meaningless. When DAV-6 lands, add `www` to the scope here in the same PR.

## 2. Why 99.9%

- **99.99% (4 min 19 s per 30 days) would be a lie.** There is no on-call human,
  no paid Vercel support and no paging. Nobody can detect and fix an outage in
  four minutes. A number with no mechanism behind it teaches people to ignore it.
- **99.5% (3 h 36 min per 30 days) buys no behaviour change.** Vercel's static
  edge already beats it with nobody watching.
- **99.9% prices our own behaviour.** The platform is not the main risk. Our
  deploys are. The site is static with no backend, so a bad deploy is the
  realistic failure. One bad deploy that takes 5 min to detect and 15 min to
  recover costs 20 min, which is **46%** of the budget. Two blow it.

The 15 minute recovery objective is the number to optimise, not the 99.9%. The
measured revert path (`docs/RUNBOOK.md` section 3, Option A) recovers in about
17 seconds of platform time plus however long it takes to decide and push, so
in practice almost all of MTTR is **detection and deciding**. That is why
`docs/runbooks/incident.md` leads with a decision rule and not with diagnosis.

## 3. What counts as an outage (the SLI)

A check is one request from outside our own network:

```
GET https://davidrydberg.dev/
```

It **passes** only if all four hold:

1. TLS handshake succeeds against a certificate valid for `davidrydberg.dev`
2. HTTP status is exactly `200`
3. the body contains the literal string `David Rydberg`
4. total time is under 5 seconds

Condition 3 exists because a blank build still returns 200. Status code alone
would miss the most likely failure.

- **An outage starts** at the first of two consecutive failed checks at least
  60 s apart.
- **An outage ends** at the first passing check.
- Downtime is counted in whole check intervals between those two points.

**Counted as downtime:** any 5xx; connection refused or timeout; TLS failure or
an expired or mismatched certificate; DNS `NXDOMAIN` or `SERVFAIL`; a 200 with
the marker string absent.

**Not counted** (an alert that fires on noise trains everyone to ignore it):

- a single failed check surrounded by passes
- failures caused by the probe's own network or host
- `404` on a path not in `sitemap.xml`, which is correct behaviour
- a slow response that still succeeds, which is the latency objective
- a stale deploy that is still serving a healthy page. That is caught by the
  build identity check, reported as a red run, and is not downtime

## 4. Who is notified, and when

There is **no human on-call and no paging** for this service. Saying otherwise
would be inventing coverage.

| Trigger | Action | Owner |
| --- | --- | --- |
| Outage detected | A `critical` Paperclip issue assigned to SRE; SRE follows `docs/runbooks/incident.md` | the check, then SRE |
| Outage open longer than 30 min | SRE comments on the CTO's standing issue mentioning the CTO | SRE |
| More than 50% of budget spent in the window (over 21 min 36 s) | SRE posts a budget notice to the CTO | SRE |
| Budget exhausted (over 43 min 12 s in 30 days) | SRE escalates with a recommendation and **requests a change freeze on `main`** until a postmortem with an owned action item exists. Only the CTO lifts the freeze | SRE, then CTO |
| Any outage | Blameless postmortem within 48 h, at least one action item with an owner and an issue | SRE |

## 5. How it is measured today, and what that misses

State this plainly. A budget with no measurement is arithmetic, not an SLO.

| Mechanism | What it does | Limits |
| --- | --- | --- |
| `.github/workflows/uptime.yml` | The section 3 SLI, cron `*/5` from GitHub. Opens a GitHub issue labelled `outage` on a confirmed failure | GitHub cron is best-effort, so the real interval is longer than 5 min and has not been measured. Blind while GitHub Actions is down. An issue is not a page, and nobody has been observed to receive a notification |
| `.github/workflows/build-identity.yml` | Every 15 min: `/health` commit, the page's `build-commit` meta tag and the head of `main` must agree | Catches a stuck or failed deploy that still serves a healthy page. Opens no issue and does not count as downtime |
| Paperclip routine "Uptime check: davidrydberg.dev" | The section 3 SLI every 30 min, appends to a local log, opens a `critical` Paperclip issue on a confirmed failure | About 30 min worst-case detection. Shares a failure domain with Paperclip |

**Consequences, stated rather than hidden:**

- The **5 minute detection objective is not claimed.** It needs (a) a measured
  gap between scheduled runs of `uptime.yml`, and (b) an alert that an agent
  actually receives. Both are tracked in DAV-14. If the measured gap cannot meet
  5 minutes, this document is amended to the measured figure.
- Until then the effective detection time is the Paperclip routine's 30 minutes.
  One bad deploy detected at 30 min and recovered at 45 min spends more than the
  whole 43 min 12 s budget. Treat any deploy-related outage as budget-critical.
- Measurement of the budget starts on **2026-09-29**. Nothing before that date is
  counted and the budget is not retroactively debited.

**What the SLI cannot see:**

- **Client-side breakage.** It reads HTML. A JavaScript bundle that 404s or
  throws leaves a blank page while the marker string still matches. This company
  has no QA agent and no browser automation, so nobody checks rendered output.
- **Per-route failures.** It probes `/` only. A broken `/builds/*` page does not register.
- **Regional failure.** One probe location; a Vercel edge failure elsewhere is invisible.
- **`www`, and email** (MX points at Google). Not the apex web path.

## 6. Recording downtime

Every outage issue title carries the UTC time of the first failed check and a
`recovered <UTC>` comment carries the first pass. The difference is the downtime.
Record it in the postmortem, with the percentage of the 43 min 12 s budget
it cost. Without those two timestamps the budget cannot be computed later.
