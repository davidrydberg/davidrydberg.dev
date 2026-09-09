# davidrydberg.dev

David Rydberg's portal: a landing page with channels, and one living Build page per project.

- `content/builds/*.md`: the Builds. Format in `content/builds/README.md`.
- `src/site.ts`: domain, identity line, channels, email.
- `CONTEXT.md`: the vocabulary. `docs/adr/`: decisions.

```
npm run dev      # compiles content, starts Vite
npm run build    # compiles content, static HTML per route
npm run typecheck && npm run lint
```
