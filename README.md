# davidrydberg.dev

My portal: a landing page with my channels, and one living Build page per project.
Live at [davidrydberg.dev](https://davidrydberg.dev).

It is a work in progress, on purpose.
Every project here is a Build with a Log, and a Log is a running record rather than a writeup at the end.
Nothing on the site claims to be finished, including the site.

## How it works

Builds are Markdown files in `content/builds/`.
Each one has frontmatter (title, oneliner, started date, links) and a `## Log` section of dated Entries.
`scripts/build-content.mjs` compiles them into a typed module at build time and writes the sitemap, so the filename becomes the slug and the URL.
`vite-react-ssg` then renders static HTML per route, which means no client-side data fetching and no CMS.

Log Entries are hand-written.
They are never generated from commits or activity, because the point is what I was thinking, not what changed.

## Running it

```
npm install
npm run dev        # compile content, start Vite
npm run build      # compile content, static HTML per route
npm run typecheck
npm run lint
```

## Layout

| Path | What |
|---|---|
| `content/builds/*.md` | The Builds. Filename is the slug and the URL |
| `scripts/build-content.mjs` | Compiles Builds, writes the sitemap |
| `src/site.ts` | Domain, identity line, channels, email |
| `src/pages/` | Home, BuildsIndex, BuildPage |
| `src/components/` | Layout, Log, BuildRow, Prompt, ChannelIcon |
| `src/index.css` | Palette, tag colours, motion |
| `CONTEXT.md` | The vocabulary this project uses |
| `docs/adr/` | Decisions and why |

## Stack

Vite, React, TypeScript, Tailwind, vite-react-ssg for static output, Vercel for hosting.
Written with Claude Code.

## License

MIT, see [LICENSE](LICENSE).
Take anything useful.
