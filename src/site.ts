/**
 * Site-wide constants. The domain is also written in scripts/build-content.mjs
 * (sitemap) and public/robots.txt; keep the three in step.
 */
export const SITE_URL = 'https://davidrydberg.dev';
export const SITE_NAME = 'David Rydberg';
export const EMAIL = 'david@aiwithdavid.se';

/** Verbatim wherever David is introduced. Do not paraphrase. */
export const IDENTITY_LINE =
  "Founder building with AI all day. Agents, automations, code, experiments. I share what I'm trying, what works, and what breaks.";

export interface Channel {
  key: string;
  handle: string;
  url: string | null; // null until the account exists
}

/** Every place David posts. Order is display order. */
export const CHANNELS: Channel[] = [
  { key: 'github', handle: 'TaskifaiDavid', url: 'https://github.com/TaskifaiDavid' },
  { key: 'x', handle: '@davrydb', url: 'https://x.com/davrydb' },
  { key: 'linkedin', handle: 'davidrydb', url: 'https://www.linkedin.com/in/davidrydb/' },
  { key: 'youtube', handle: 'coming soon', url: null },
  { key: 'tiktok', handle: 'coming soon', url: null },
];
