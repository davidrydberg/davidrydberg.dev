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
`vite-react-ssg` then renders static HTML per route. There is no CMS.
The homepage contribution count is the one piece that loads after the page: it asks `/api/github-contributions`, and the page still renders if that request fails.

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

`npm run dev` also serves `/api/github-contributions`. Set `GITHUB_TOKEN` in the environment (see `.env.example`) to see the count. Without it, the line stays hidden.

## Contribution count

The homepage shows how many public GitHub contributions I have made in the current calendar year, in Europe/Stockholm.
`api/github-contributions.ts` reads `contributionsCollection.contributionCalendar.totalContributions` from 1 January through now.
The response is cached for a day: `s-maxage=86400` and `stale-while-revalidate=86400`.
On 1 January the window starts over by itself. Nobody edits the year.
The token stays on the server. If it is missing, or GitHub errors, the line is left out. The build does not need the token, and the page does not show 0 or an error.

In Vercel, add `GITHUB_TOKEN` for Production (and Preview, if preview URLs should show it), then redeploy.
Use a fine-grained or classic personal access token with no scopes. Public contribution data is enough. Do not prefix the name with `VITE_`.

## Layout

| Path | What |
|---|---|
| `content/builds/*.md` | The Builds. Filename is the slug and the URL |
| `scripts/build-content.mjs` | Compiles Builds, writes the sitemap |
| `src/site.ts` | Domain, identity line, channels, email |
| `src/pages/` | Home, BuildsIndex, BuildPage |
| `src/components/` | Layout, Log, BuildRow, Subscribe, SubscribePopup |
| `src/index.css` | Palette, tag colours, motion |
| `api/subscribe.ts` | Newsletter signup. Needs `RESEND_API_KEY` |
| `api/github-contributions.ts` | Homepage contribution count. Needs `GITHUB_TOKEN` |
| `CONTEXT.md` | The vocabulary this project uses |
| `docs/adr/` | Decisions and why |

## Stack

Vite, React, TypeScript, Tailwind, vite-react-ssg for static output, Vercel for hosting.
Written with Claude Code.

## License

MIT, see [LICENSE](LICENSE).
Take anything useful.
