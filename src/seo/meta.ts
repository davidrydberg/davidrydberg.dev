import { SITE_URL, SITE_NAME, IDENTITY_LINE } from '../site';

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
}

export const routeMeta = {
  '/': {
    title: SITE_NAME,
    description: IDENTITY_LINE,
    canonical: `${SITE_URL}/`,
  },
  '/builds': {
    title: `Builds | ${SITE_NAME}`,
    description: 'Living pages for the things I build with AI: what I tried, what works, what broke.',
    canonical: `${SITE_URL}/builds`,
  },
} satisfies Record<string, RouteMeta>;

export type RoutePath = keyof typeof routeMeta;
