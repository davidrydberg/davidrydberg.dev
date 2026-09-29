/**
 * Build identity: which commit this build came from and when it was built.
 * Shared by scripts/build-content.mjs (writes public/health.json) and
 * vite.config.ts (injects the build-commit meta tag), so both signals agree.
 *
 * Commit source, in order: Vercel, GitHub Actions, the local git checkout.
 * An unresolvable commit is reported as "unknown" rather than failing the build.
 */
import { execFileSync } from 'node:child_process';

const SHORT_SHA_LENGTH = 7;

const resolveCommit = () => {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return fromEnv.slice(0, SHORT_SHA_LENGTH);
  try {
    return execFileSync('git', ['rev-parse', `--short=${SHORT_SHA_LENGTH}`, 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
};

const commit = resolveCommit();
const builtAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

export const getBuildInfo = () => ({ commit, builtAt });
