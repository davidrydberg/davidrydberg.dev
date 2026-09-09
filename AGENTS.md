# davidrydberg.dev

David Rydberg's portal: a landing page with his channels, and one living Build page per project.
English only. Built for fun, openly a work in progress.

## Read first

- `CONTEXT.md`: the vocabulary (Builder, Portal, Build, Log, Entry, Build status, Channel). Use these words.
- `docs/adr/`: decisions and why. Read before proposing a structural change.
- `content/builds/README.md`: the Build file format.

## Layout

| Path | What |
|---|---|
| `content/builds/*.md` | The Builds. Filename is the slug and URL |
| `scripts/build-content.mjs` | Compiles Builds to `src/content/builds.generated.ts` and writes the sitemap |
| `src/site.ts` | Domain, identity line, channels, email |
| `src/pages/` | Home, BuildsIndex, BuildPage |
| `src/components/` | Layout, Log, BuildRow, Prompt, ChannelIcon, motion helpers |
| `src/index.css` | Palette, tag colours, all motion |

## Commands

```
npm run dev        # compile content, start Vite
npm run build      # compile content, static HTML per route (vite-react-ssg)
npm run typecheck
npm run lint
```

## Rules

- The identity line in `src/site.ts` is verbatim. Never paraphrase it.
- Nothing on the site is presented as finished. No "complete", "done", "final".
- Log Entries are hand-written. Never generate them from commits or activity.
- Generated files are gitignored. Edit the Markdown, not `builds.generated.ts` or `sitemap.xml`.
- The domain is written in three places: `src/site.ts`, `scripts/build-content.mjs`, `public/robots.txt`.
- Workspace rules from `~/David/AGENTS.md` apply: no em dashes, ASCII only, no secrets, no agent co-author.
