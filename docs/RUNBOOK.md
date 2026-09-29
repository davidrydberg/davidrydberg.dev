# Runbook — deploy and rollback for davidrydberg.dev

Audience: anyone with push access to this repo, who has never deployed it before.
Every command below is copy-pasteable. Expected output is shown for each.

## 1. How a commit becomes a running site

```
git push / merge to main
        │
        ├─> GitHub Actions "CI" (.github/workflows/ci.yml)
        │     lint → typecheck → build, uploads dist/ as an artifact
        │
        └─> Vercel Git integration
              runs `npm run build`, serves dist/ at https://davidrydberg.dev
```

Two things to understand before you touch production:

- **CI and Vercel run in parallel, not in sequence.** GitHub Actions does not
  gate the Vercel deploy itself. What stops a red change is branch protection
  on `main` (section 6): a PR cannot merge until `lint / typecheck / build` is
  green. Only an admin can bypass that, by pushing directly, and that is
  reserved for rollback. A direct push to `main` still deploys even if CI fails.
- **`main` is production.** There is no staging environment. Vercel builds
  preview deployments for pull requests; those are the only pre-production
  environment that exists today.

| Thing | Value |
| --- | --- |
| Production URL | https://davidrydberg.dev |
| Production branch | `main` |
| Host | Vercel (`server: Vercel` response header) |
| Build command | `npm run build` (see `package.json`) |
| Output directory | `dist` (see `vercel.json`) |
| CI workflow | `.github/workflows/ci.yml` |

## 2. Deploy a change

Never push straight to `main`. Use a branch so CI runs before production does.
This applies to agents too: agents push as the `davidrydberg` GitHub identity,
which is an admin and can bypass branch protection, so the only thing stopping
an agent from pushing to `main` is this rule. The one exception is rollback
(section 3).

```bash
git checkout -b my-change
# ...edit...
git commit -am "Describe the change"
git push -u origin my-change
gh pr create --fill
gh pr checks --watch        # wait for CI to go green
gh pr merge --squash        # this is the deploy
```

Expected from `gh pr checks --watch`:

```
✓  lint / typecheck / build  ...  https://github.com/davidrydberg/davidrydberg.dev/actions/runs/<id>/job/<id>
```

A green run takes about 30 seconds.

The gate has been verified to actually fail: a commit with a deliberate type
error produced `X Typecheck`, skipped `Build`, and a run conclusion of
`failure`. A gate nobody has seen go red is not a gate.

If CI is red, **do not merge.** Read the failing step:

- `Lint` fails → `npm run lint` locally, fix, push again.
- `Typecheck` fails with `Cannot find module './content/builds.generated'` →
  you ran `tsc` without generating content. Run `npm run content` first. CI
  already does this; if CI shows it, the generator itself broke — check
  `scripts/build-content.mjs`.
- `Build` fails → reproduce with `npm ci && npm run build`.

### Verify the deploy landed

Vercel takes roughly 1-2 minutes after the merge. A `200` from `/` does not
prove the new build is live: the edge can serve a stale cached page for days.
`/health` is generated at build time and is never cached, so it names the build.

```bash
curl -sS --max-time 20 https://davidrydberg.dev/health
git rev-parse --short=7 origin/main
```

Expected: JSON with `"status": "ok"` and a `commit` equal to the second
command's output. Until they match, the deploy has not landed (or the Vercel
build failed and the previous deployment is still serving).

Independent second signal, from the page a visitor actually receives:

```bash
curl -sS --max-time 20 https://davidrydberg.dev/ | grep -o '<meta name="build-commit"[^>]*>'
```

Expected: `<meta name="build-commit" content="<same short SHA>">`.

Anything other than `200` means the deploy is broken — go to section 3.

## 3. Rollback

### Option A — revert the commit (works today, no extra credentials)

This is the supported rollback path right now. It pushes directly to `main`,
which branch protection allows only because admin bypass is enabled on purpose
(section 6). It is the only situation where a direct push to `main` is right.
It is a roll *forward* to the
previous content: git reverts the bad commit, the push triggers a fresh Vercel
build, and production returns to its prior state.

```bash
git checkout main
git pull --ff-only origin main
git log --oneline -5                      # identify the bad commit <SHA>
git revert --no-edit <SHA>
git push origin main
```

Expected output from the revert and push:

```
[main <newsha>] Revert "<original subject>"
 N files changed, ...
To https://github.com/davidrydberg/davidrydberg.dev.git
   <oldsha>..<newsha>  main -> main
```

Then wait for Vercel to rebuild and confirm:

```bash
sleep 30
curl -sS --max-time 20 https://davidrydberg.dev/health
```

Expected: `"status": "ok"` and a `commit` equal to the revert commit's short SHA
(`git rev-parse --short=7 origin/main`), so the bad change is gone.

**Measured time to recover: ~17 seconds** from `git push` to the reverted
content being served. This was timed on 2026-09-29 by deploying a marker to
production and reverting it — see "Rollback drill" below. Budget a minute;
it has been faster than that.

To confirm you are looking at a fresh deploy rather than a cached response,
check that `age` has reset and `etag` changed:

```bash
curl -sSI https://davidrydberg.dev/ | grep -iE '^(HTTP|etag|last-modified|age)'
```

Note that `etag` changes on **every** build even when content is unchanged:
`vite-react-ssg` embeds a per-build nonce (`__VITE_REACT_SSG_HASH__`) in the
HTML. A changed `etag` proves a redeploy happened, not that content changed.

### Rollback drill (verified 2026-09-29)

The procedure above is not theoretical. It was executed end to end against
production:

| Step | Commit | Result |
| --- | --- | --- |
| Deploy an invisible HTML marker to `main` | `dc249c3` | marker live in production after ~40s, `etag` `98c82567…` → `e3d50d58…` |
| `git revert --no-edit dc249c3 && git push origin main` | `bdadb87` | marker gone after ~17s, `status=200`, `etag` → `998896a3…` |

Verification that the rollback was complete, not just marker-free: a clean
local build of `main` at `bdadb87` was compared byte-for-byte against the
served page. The only difference was the per-build `__VITE_REACT_SSG_HASH__`
nonce described above.

Re-run this drill after any change to hosting, the build command, or the
output directory. A rollback path that has not been exercised since the last
infrastructure change is an assumption, not a procedure.

**If the revert conflicts** (someone pushed on top of the bad commit), do not
force-push `main`. Resolve the conflict in the revert commit:

```bash
git status                # shows conflicted paths
# fix the files
git add -A
git revert --continue
git push origin main
```

**If the site is still broken after the revert**, the failure is not in the
reverted commit. Check the Vercel build log in the dashboard before pushing
anything else — a failed Vercel build leaves the *previous* deployment serving,
so a 200 with stale content means the new build failed rather than deployed.

### Option B — Vercel instant rollback (faster, not available yet)

Vercel can re-promote a previous deployment without rebuilding, which recovers
in seconds instead of ~2 minutes:

```bash
vercel rollback <previous-deployment-url> --token "$VERCEL_TOKEN"
```

**This does not work today.** There is no Vercel CLI and no `VERCEL_TOKEN` in
this environment (`GET /api/agents/me/secrets` returns an empty list). Until a
project-scoped Vercel token is provisioned as a Paperclip secret, Option A is
the only rollback an agent can execute. The same rollback is also available by
hand in the Vercel dashboard: **Deployments → pick the last good one →
Promote to Production**.

## 4. Uptime monitor

`.github/workflows/uptime.yml` checks production from GitHub's network, so it
fails independently of Paperclip and of Vercel. It is the SLI from the DAV-5
reliability plan (section 1.3), and SRE owns that definition.

**What it checks.** `GET https://davidrydberg.dev/` passes only if all four hold:

1. TLS is valid for the host (curl verifies the certificate; `-k` is never used)
2. HTTP status is exactly `200` (redirects are not followed)
3. the body contains the literal string `David Rydberg`
4. the whole request finishes within 5 seconds (`curl --max-time 5`)

**When.** Cron `*/5 * * * *`, plus manual runs. One failed check waits 60 s and
retries once; only the second consecutive failure is an outage.

**Where alerts appear.**

- A GitHub issue labelled `outage`, titled `Outage: davidrydberg.dev <UTC time
  of the first failed check>`, with the curl output in the body. While one is
  open, further failures comment on it instead of opening a duplicate.
- The run itself goes red in the Actions tab.
- When a check passes again, the issue gets a `recovered <UTC>` comment and is
  closed. The issue title time and the `recovered` time are the downtime to
  charge to the error budget.

```bash
gh issue list --repo davidrydberg/davidrydberg.dev --label outage --state all
gh run list --repo davidrydberg/davidrydberg.dev --workflow uptime.yml --limit 10
```

**Test the failure path without touching production.** Point it at a route that
does not exist. It opens an `outage` issue after about 65 s and the run goes
red. Then run it again with no `url` and it closes the issue.

```bash
gh workflow run uptime.yml --repo davidrydberg/davidrydberg.dev \
  -f url=https://davidrydberg.dev/this-route-does-not-exist-monitor-test
gh workflow run uptime.yml --repo davidrydberg/davidrydberg.dev
```

A manual run shares the same `outage` issue as the scheduled ones, so a test
run made during a real outage will comment on, or close, the real issue.

**Disable it.** Reversible, no commit needed:
`gh workflow disable uptime.yml --repo davidrydberg/davidrydberg.dev`
(re-enable with `gh workflow enable`). To remove it for good, delete
`.github/workflows/uptime.yml` in a PR. Nothing else depends on it, and it makes
no change to the site. The worst a bad edit can do is open a false `outage` issue.

**Permissions.** `contents: read` and `issues: write` on the built-in
`GITHUB_TOKEN`. No repository secrets, no personal access token, and no
third-party actions.

**Known limits. Read these before trusting it.**

- **GitHub cron is best-effort.** Scheduled runs are delayed and sometimes
  skipped under load, so the real interval is longer than 5 minutes. Do not
  claim a 5 minute detection objective from this alone. Measure the gaps with
  `gh run list --workflow uptime.yml --event schedule`.
- **It goes silent after 60 days without repository activity.** GitHub disables
  scheduled workflows on a repo with no activity for 60 days. Nothing here keeps
  it alive; pushes to the repo do. This is a known limit, not solved. Check that
  the newest scheduled run is recent, and re-enable with
  `gh workflow enable uptime.yml` if it is not.
- **It cannot see an outage while GitHub Actions is itself degraded.** That is
  why the Paperclip routine from DAV-8 (option A) stays as a slow cross-check
  with a different failure domain.
- **An issue is not a page.** Whether a new `outage` issue or a failed run
  emails anyone depends on that person's GitHub notification settings. No
  notification delivery has been observed, so do not assume a human is alerted.
  There is still no on-call human (see the DAV-5 plan, section 1.4).

### Build identity check

`.github/workflows/build-identity.yml` runs `scripts/check-build-identity.sh`
every 15 minutes. It answers a question the uptime monitor cannot: is the live
site the build `main` says it should be? It passes only if all three agree:
`/health` `commit`, the `build-commit` meta tag on `/`, and the head of `main`.

- On a mismatch it retries for 6 minutes (a normal deploy), then fails the run.
  It opens no issue and is not counted as downtime; a red run means "the deploy
  is stale or broken", so go to section 3.
- Run it by hand: `bash scripts/check-build-identity.sh https://davidrydberg.dev`
  (exit 0 and one `OK:` line on success; `FAIL:` and exit 1 otherwise).
- It shares the uptime monitor's limits: best-effort cron, and no alert delivery
  has been observed. Disable with `gh workflow disable build-identity.yml`.
- What it misses: it does not measure latency or TLS, and it trusts that
  `origin/main` is what should be live (a revert changes `main`, so it stays true).

## 5. What is deliberately not here

- **No paging and no incident process in this runbook.** The uptime monitor
  above detects; it does not page anyone. Incident response is owned by SRE,
  not by this runbook.
- **No staging environment.** Vercel PR previews are the closest thing.
- **No required reviewers.** No second human or agent reviewer exists, so a
  review requirement would be either bypassed or a deadlock.
- **No admin enforcement on `main`.** Deliberate, see section 6.

## 6. Branch protection on `main`

Configured 2026-09-29 (DAV-16, decision on DAV-4: enable with admin bypass).
This is what makes CI a lock instead of an alarm.

| Setting | Value | Why |
| --- | --- | --- |
| Required status check | `lint / typecheck / build` | A PR cannot merge while CI is red or missing |
| `strict` (branch must be up to date) | `false` | PRs are small and sequential; forcing a rebase per merge is toil |
| `enforce_admins` | `false` | Admin bypass is deliberate: rollback is `git revert && git push origin main` and must stay a fast break-glass path (MTTR over MTBF). The owner can also push to their own site |
| Required PR reviews | none | No second reviewer exists |
| Force pushes | blocked | History on `main` is what rollback relies on |
| Branch deletion | blocked | |

**Rules that follow from this:**

- Normal changes go via PR and merge only when `lint / typecheck / build` is green.
- A direct push to `main` is break-glass, for rollback only (section 3).
- Agents push as the `davidrydberg` identity, so admin bypass means agents can
  technically push to `main`. They must not, except for rollback. Nothing but
  this rule enforces it.
- The check name must match the job `name:` in `ci.yml` exactly. If you rename
  the job, update the protection in the same change, or every PR will sit
  "Expected" forever.

**Inspect:**

```bash
gh api repos/davidrydberg/davidrydberg.dev/branches/main/protection \
  --jq '{checks: .required_status_checks.contexts, strict: .required_status_checks.strict, enforce_admins: .enforce_admins.enabled, force_push: .allow_force_pushes.enabled, deletions: .allow_deletions.enabled}'
```

Expected: `{"checks":["lint / typecheck / build"],"deletions":false,"enforce_admins":false,"force_push":false,"strict":false}`

**Re-apply** (idempotent):

```bash
gh api -X PUT repos/davidrydberg/davidrydberg.dev/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {"strict": false, "contexts": ["lint / typecheck / build"]},
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

**Remove protection entirely** (one call; use if CI itself is broken and blocking a rollback
that admin bypass somehow cannot cover):

```bash
gh api -X DELETE repos/davidrydberg/davidrydberg.dev/branches/main/protection
```

Removing it also removes the force-push and deletion blocks. Re-apply straight after.
