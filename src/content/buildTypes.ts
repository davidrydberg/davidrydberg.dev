/** Tags an Entry can carry. SHIPPED, PARKED and DEAD also set the Build status. */
export const ENTRY_TAGS = ['TRIED', 'WORKS', 'BROKE', 'SHIPPED', 'PARKED', 'DEAD', 'NOTE'] as const;
export type EntryTag = (typeof ENTRY_TAGS)[number];

export type BuildStatus = 'Building' | 'Shipped' | 'Parked' | 'Dead';

export interface Entry {
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  tag: EntryTag;
  text: string;
  detailHtml?: string;
}

export interface BuildLink {
  label: string;
  url: string;
}

export interface Build {
  slug: string;
  path: string;
  title: string;
  oneliner: string;
  status: BuildStatus;
  started: string;
  updated: string;
  links: BuildLink[];
  whyHtml: string;
  stackHtml: string;
  log: Entry[];
}
