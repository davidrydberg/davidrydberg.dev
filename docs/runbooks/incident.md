# Runbook: incident response for davidrydberg.dev

Audience: anyone who has never touched this system, under pressure.
Deploy, rollback commands and the monitors live in `docs/RUNBOOK.md`. This file
says **when** to use them and what to do when they do not work. The target and
what counts as downtime are in `docs/reliability/slo.md`.

The site is static (Vite, prerendered HTML on Vercel) with no server, database
or API. The only realistic failure is a bad deploy, so **rollback comes before
diagnosis**.

## 0. How you find out

Someone notices, or one of these fires. Nothing pages a human.

| Signal | Where | Means |
| --- | --- | --- |
| GitHub issue labelled `outage`, titled `Outage: davidrydberg.dev <UTC>` | `gh issue list --repo davidrydberg/davidrydberg.dev --label outage --state open` | `uptime.yml` saw two consecutive failures. The UTC in the title is the first failure |
| Red run of `build-identity.yml` | `gh run list --repo davidrydberg/davidrydberg.dev --workflow build-identity.yml --limit 5` | The live build is not the head of `main`. A stale or failed deploy. The site may still be up |
| Paperclip issue `Outage: ...`, priority `critical`, assigned to SRE | Paperclip | The slower cross-check routine saw a failure |

A manual test of the monitor also opens an `outage` issue. Check the issue body
for a deliberate `this-route-does-not-exist` URL before treating it as real.

## 1. Confirm it is real (30 seconds)

Never act on one failed check.

```bash
curl -sS -o /dev/null -w 'code=%{http_code} time=%{time_total}s\n' --max-time 20 https://davidrydberg.dev/
curl -sS --max-time 20 https://davidrydberg.dev/ | grep -c 'David Rydberg'
curl -sS --max-time 20 https://davidrydberg.dev/health
```

Healthy output (measured 2026-09-29):

```
code=200 time=0.09s
5
{
  "status": "ok",
  "commit": "d78d5bf",
  "builtAt": "2026-09-29T21:25:57Z"
}
```

- `code=200`, a count of 1 or more, and JSON with `"status": "ok"`: the site is
  up. If the alert was a `build-identity` failure, go to section 2 and read
  the "stale deploy" branch. Otherwise close the alert as a false positive and
  note it in the issue.
- `code=5xx`, `code=000`, or a count of `0`: **real outage.** A 200 with a count
  of `0` is worse than a 5xx, because it is a blank or broken page that nothing
  else flags. Continue to section 2.

`curl` exit 60 means the certificate does not match the host. Go to section 3, D2.

## 2. Decide: roll back or diagnose (the 5 minute rule)

> **If a deploy went out in the last 60 minutes, roll back first. Diagnose second.**
> Diagnosing on a live outage spends error budget at the same rate as doing nothing.

```bash
git fetch origin
git log -3 --format='%h %ad %s' --date=iso origin/main
curl -sS --max-time 20 https://davidrydberg.dev/health
```

- The newest commit on `origin/main` is under 60 minutes old: **roll back.** Follow
  `docs/RUNBOOK.md` section 3, Option A (`git revert --no-edit <SHA>` then push).
  Measured recovery: about 17 seconds after the push, plus the time you take to type
  it. `main` is protected (`docs/RUNBOOK.md` section 6) but admin bypass is on
  deliberately, so the direct `git push origin main` of a revert is allowed as
  break-glass. If it is rejected anyway, revert on a branch and merge it through a
  pull request once `lint / typecheck / build` is green.
  **Never force-push `main`.**
- No recent commit: rollback will not help, go to section 3. A static site that
  changed nothing and broke points at DNS, the certificate, or Vercel.
- **Stale deploy** (`/health` `commit` differs from `git rev-parse --short=7
  origin/main` for more than 6 minutes, but the site is up): the Vercel build
  failed and the previous deployment is still serving. Open the deployment in
  the Vercel dashboard for the build log. Fix forward on a branch or revert the
  commit. The site is not down, so this is not charged to the budget.

Open the incident issue **while** you do this, not after: a Paperclip issue,
priority `critical`, assigned to SRE, titled `Outage: davidrydberg.dev <UTC>`,
with the section 1 output as the first comment. If a GitHub `outage` issue is
already open, comment there as well.

### Verify the rollback worked. Do not skip this.

```bash
sleep 30
curl -sS --max-time 20 https://davidrydberg.dev/health
git rev-parse --short=7 origin/main
curl -sS --max-time 20 https://davidrydberg.dev/ | grep -c 'David Rydberg'
```

Expected: `"status": "ok"`, a `commit` equal to the revert commit's short SHA, and a
count of 1 or more.

- `commit` still the old SHA after 2 minutes: the Vercel build for the revert
  failed or is queued. Check the dashboard build log. Do not push more commits.
- Do **not** use `?cachebust=` to test freshness. Measured 2026-09-29: the query
  string still returned `x-vercel-cache: HIT`. `/health` is `cache-control:
  no-store` and names the build, so it is the reliable check.

Then record, on the incident issue: the commit you reverted, the revert commit, the
first failed check time and the first passing check time. The difference is the
downtime charged to the budget.

## 3. Diagnose (only when rollback is not the answer)

Work from the outside in. Stop at the first step that fails; that is your layer.

**D1. DNS.**

```bash
dig +short davidrydberg.dev A
dig +short davidrydberg.dev NS
```

Expected: two A records, and the nameservers `ns1.vercel-dns.com.` and
`ns2.vercel-dns.com.` (measured 2026-09-29). The A addresses have already
changed once (`64.29.17.x` to `216.198.79.65`), so do not alarm on the exact IPs.
Empty output or different nameservers means the delegation changed or the
registration lapsed. **Do not change registration or DNS yourself.** Escalate to the
CTO at once: it is above SRE's authority and may involve a payment.

**D2. TLS.**

```bash
echo | openssl s_client -connect davidrydberg.dev:443 -servername davidrydberg.dev 2>/dev/null \
  | openssl x509 -noout -subject -dates
dig +short davidrydberg.dev CAA
```

Expected: `subject=CN=davidrydberg.dev` and a `notAfter` in the future (Let's Encrypt,
`Dec  8 2026` at last check). CAA is expected to include `0 issue "letsencrypt.org"`
(measured: it also lists `sectigo.com` and `pki.goog`). Vercel renews
automatically; a failed renewal usually means a DNS or CAA change. Escalate.

**D3. Edge or deployment.** Tests every published address on its own.

```bash
for ip in $(dig +short davidrydberg.dev A); do
  echo -n "$ip -> "
  curl -sS -o /dev/null -w '%{http_code}\n' --max-time 15 \
    --resolve "davidrydberg.dev:443:$ip" https://davidrydberg.dev/
done
```

Expected: `200` for every address. Some pass and some fail means a regional edge
problem: Vercel's to fix. Record it and wait; rollback will not help.

**D4. The build.** Run in a clean clone, and generate content before typechecking.

```bash
git clone https://github.com/davidrydberg/davidrydberg.dev.git && cd davidrydberg.dev
npm ci
npm run content        # typecheck fails with "Cannot find module ./content/builds.generated" without this
npm run typecheck
npm run lint
npm run build
ls dist/index.html && grep -c 'David Rydberg' dist/index.html
```

Expected (measured 2026-09-29): every command exits 0, `dist/index.html` exists,
grep prints 1 or more. If the build fails locally, the deploy was always going to
fail. Fix forward on a branch, never directly on `main`.

**Known, unrelated defect:** `https://www.davidrydberg.dev/` fails with curl exit
60 (certificate does not cover `www`). That is DAV-6, it is out of the SLI, and it
is not an incident. Do not roll anything back for it.

## 4. When none of it works: escalate

Comment on the CTO's standing issue, mentioning the CTO, with: the section 1 output,
which of D1 to D4 failed, what you already tried, how long the site has been down,
and the share of the 43 min 12 s budget spent so far.

Escalate at once, without waiting for 30 minutes, if the cause is DNS, the domain
registration, billing, or Vercel account access.

There is no human on-call. If the CTO cannot resolve it, the CTO routes to the CEO.

**Never, without an explicit approval recorded on the incident issue:** delete a
Vercel project or deployment, change nameservers, re-register or transfer the
domain, rotate a live credential, or force-push `main`. Rollback is always allowed
during an incident. Destruction is not.

## 5. After the incident

Within 48 hours, copy `docs/postmortems/TEMPLATE.md` to
`docs/postmortems/<YYYY-MM-DD>-<slug>.md`, fill it in and open a PR. Blameless:
describe what the system allowed, never who erred. It is incomplete without at
least one action item that has an owner and an issue.

If the 30 day budget is now exhausted, request the change freeze described in
`docs/reliability/slo.md` section 4.

## 6. Credentials

No credential belongs in this repository, an issue comment or a provider console
note. Vercel's instant rollback (`docs/RUNBOOK.md` section 3, Option B) needs a
project-scoped token that does not exist yet (DAV-15). If a step asks for a
credential you do not have, use the git revert path and say so on the incident issue.
Never paste a token into a comment while asking for help.
