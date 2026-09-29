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
  gate the Vercel deploy. A push to `main` starts the deploy immediately, even
  if CI is still running or has already failed. CI is a fast alarm, not a lock.
  Until branch protection requiring the `lint / typecheck / build` check is
  enabled on `main`, **the gate is you: open a PR and wait for green.**
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

If CI is red, **do not merge.** Read the failing step:

- `Lint` fails → `npm run lint` locally, fix, push again.
- `Typecheck` fails with `Cannot find module './content/builds.generated'` →
  you ran `tsc` without generating content. Run `npm run content` first. CI
  already does this; if CI shows it, the generator itself broke — check
  `scripts/build-content.mjs`.
- `Build` fails → reproduce with `npm ci && npm run build`.

### Verify the deploy landed

Vercel takes roughly 1–2 minutes after the merge.

```bash
curl -sS -o /dev/null -w "status=%{http_code}\n" https://davidrydberg.dev/
```

Expected:

```
status=200
```

Anything other than `200` means the deploy is broken — go to section 3.

## 3. Rollback

### Option A — revert the commit (works today, no extra credentials)

This is the supported rollback path right now. It is a roll *forward* to the
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
sleep 90
curl -sS -o /dev/null -w "status=%{http_code}\n" https://davidrydberg.dev/
```

Expected: `status=200`, and the bad change is gone from the served page.

Time to recover: about 2 minutes, dominated by the Vercel rebuild.

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

## 4. What is deliberately not here

- **No uptime check, no alerting, no incident process.** Nothing is watching
  this site. Owned by SRE, not by this runbook.
- **No staging environment.** Vercel PR previews are the closest thing.
- **No branch protection on `main`** — see the warning in section 1.
