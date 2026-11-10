/**
 * Public GitHub contribution count for the homepage.
 * Server-side only: GITHUB_TOKEN is read here and never sent to the browser.
 * A fine-grained or classic token with no scopes is enough for public data.
 *
 * The window is the current calendar year in Europe/Stockholm, from 1 January
 * through now, so the count rolls over on its own at midnight on 1 January.
 * Success is cached for a day. A missing token or an upstream error is not
 * cached, and the homepage hides the line.
 */

const USER = 'davidrydberg';
const ZONE = 'Europe/Stockholm';
const DAY = 86400;

const FRESH = `public, max-age=${DAY}, s-maxage=${DAY}, stale-while-revalidate=${DAY}`;
const BYPASS = 'no-store';

const QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
      }
    }
  }
}`;

type GraphPayload = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: { totalContributions?: unknown };
      };
    } | null;
  };
  errors?: unknown;
};

/** Offset of Europe/Stockholm at `instant`, as ±HH:MM. January is +01:00. */
export const stockholmOffset = (instant: Date): string => {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    timeZoneName: 'longOffset',
  })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value;

  const match = name?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return '+01:00';
  return `${match[1]}${match[2].padStart(2, '0')}:${match[3] ?? '00'}`;
};

export const stockholmYear = (instant: Date): number =>
  Number(new Intl.DateTimeFormat('en-US', { timeZone: ZONE, year: 'numeric' }).format(instant));

/** From 1 January 00:00 Europe/Stockholm through `now`. */
export const contributionWindow = (now = new Date()) => {
  const year = stockholmYear(now);
  // Noon UTC on 1 January is still CET, so the offset is the new year's offset.
  const offset = stockholmOffset(new Date(Date.UTC(year, 0, 1, 12, 0, 0)));
  return {
    year,
    from: `${year}-01-01T00:00:00${offset}`,
    to: now.toISOString(),
  };
};

const reply = (status: number, cache: string, body?: unknown) =>
  Response.json(body ?? {}, {
    status,
    headers: { 'Cache-Control': cache },
  });

export async function GET() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    console.error('github contributions: GITHUB_TOKEN is not set');
    return reply(503, BYPASS);
  }

  const { year, from, to } = contributionWindow();

  let upstream: Response;
  try {
    upstream = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'davidrydberg.dev',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: USER, from, to } }),
    });
  } catch (error) {
    console.error('github contributions: request failed', error instanceof Error ? error.name : 'error');
    return reply(503, BYPASS);
  }

  if (!upstream.ok) {
    console.error('github contributions: upstream', upstream.status);
    return reply(503, BYPASS);
  }

  let payload: GraphPayload;
  try {
    payload = (await upstream.json()) as GraphPayload;
  } catch {
    console.error('github contributions: bad json');
    return reply(503, BYPASS);
  }

  if (payload.errors || !payload.data?.user) {
    console.error('github contributions: graphql error');
    return reply(503, BYPASS);
  }

  const count =
    payload.data.user.contributionsCollection?.contributionCalendar?.totalContributions;

  // Hide 0 as well. A brand new year, or a surprised zero, should not render.
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 1) {
    return reply(503, BYPASS);
  }

  return reply(200, FRESH, { count, year });
}
