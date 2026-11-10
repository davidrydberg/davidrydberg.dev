/**
 * Homepage copy from the approved mockup. Keep the wording exact.
 * Apostrophes are straight quotes. Malmö keeps its ö.
 */

export interface SelectedWork {
  title: string;
  when?: string;
  context: string;
  what: string;
  tags: string[];
}

export const SELECTED_WORK: SelectedWork[] = [
  {
    title: 'End-to-end test environment',
    when: '2026',
    context: 'E-commerce platform',
    what: 'A sealed test world that resets itself and mirrors real orders. Every deploy has to pass it before it ships.',
    tags: ['Testing', 'CI/CD'],
  },
  {
    title: 'AI on-call system',
    when: '2026',
    context: 'E-commerce platform',
    what: 'Health checks, staged alerts and AI agents with read-only access that investigate incidents and propose fixes.',
    tags: ['Agents', 'MCP', 'Monitoring'],
  },
  {
    title: 'Automated security reviews',
    when: '2026',
    context: 'E-commerce platform',
    what: 'A weekly AI audit of every codebase that runs on its own and reports in plain language.',
    tags: ['Agents', 'Security'],
  },
  {
    title: 'Operations console',
    when: '2026',
    context: 'E-commerce platform',
    what: 'An internal admin tool with permissions, audit trail, statistics and customer timelines.',
    tags: ['Internal tools', 'Vue', 'Laravel'],
  },
  {
    title: 'Payments and checkout',
    when: '2026',
    context: 'E-commerce platform',
    what: 'Mobile payments, BankID signing and credit checks, with automatic recovery for failed orders.',
    tags: ['Payments', 'API'],
  },
  {
    title: 'Sign-up and onboarding',
    when: '2026',
    context: 'E-commerce platform',
    what: 'A multi-step onboarding flow, rebuilt across API, app and website.',
    tags: ['Product', 'Full stack'],
  },
  {
    title: 'AI email triage',
    context: 'Retailer',
    what: 'An AI agent that sorts incoming customer email.',
    tags: ['Agents', 'Email'],
  },
];

export interface HomeBuild {
  name: string;
  /** In-app path, or an external repo when `external` is set. */
  href: string;
  external?: boolean;
  status: string;
  description: string;
  /** Repo URL shown at the end of the row. */
  repo?: string;
  /** Shown at the end of the row when there is no repo link. */
  updated?: string;
}

export const HOME_BUILDS: HomeBuild[] = [
  {
    name: 'git-judge-jev',
    href: '/builds/git-judge-jev',
    status: 'Building',
    description:
      'One review comment for agent-written PRs. Eval: must-read hunks in the top 5 went from 70% to 90%, precision 86%.',
    repo: 'https://github.com/davidrydberg/git-judge-jev',
  },
  {
    name: 'proofy',
    href: 'https://github.com/davidrydberg/proofy',
    external: true,
    status: 'Public',
    description:
      'Sealed end-to-end tests your coding agent writes and you approve, with evidence and screenshots per requirement.',
    repo: 'https://github.com/davidrydberg/proofy',
  },
  {
    name: 'mergeq',
    href: 'https://github.com/davidrydberg/mergeq',
    external: true,
    status: 'Public',
    description: 'Which open PRs can merge, which conflict, and in what order to merge them.',
    repo: 'https://github.com/davidrydberg/mergeq',
  },
  {
    name: 'nm-board',
    href: 'https://github.com/davidrydberg/nm-board',
    external: true,
    status: 'Public',
    description:
      "Live terminal view of firstmate's agents: no-mistakes stage, PRs, status, and captain decisions.",
    repo: 'https://github.com/davidrydberg/nm-board',
  },
  {
    name: 'safe-order-retries',
    href: '/builds/safe-order-retries',
    status: 'Building',
    description: "Order pipeline safe to retry, so a timeout can't ship a duplicate.",
    updated: '2026-10-04',
  },
  {
    name: 'invoice-rounding',
    href: '/builds/invoice-rounding',
    status: 'Building',
    description: 'Invoices that match the charge, down to the smallest currency unit.',
    updated: '2026-10-03',
  },
  {
    name: 'portal',
    href: '/builds/portal',
    status: 'Building',
    description: 'Rebuilding this site into a portal to my work, in the open.',
    updated: '2026-09-09',
  },
];
