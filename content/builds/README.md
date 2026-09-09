# Builds

One Markdown file per Build. The filename is the slug and the URL: `portal.md` -> `/builds/portal`.

## Frontmatter

```yaml
title: Dev portal
oneliner: Rebuilding my site as a portal to my work
started: 2026-09-09
links:
  - label: live
    url: https://davidrydberg.dev
draft: false
```

## Body

Three sections, by heading. `## Why` and `## Stack` are plain Markdown.
`## Log` is the log. One line per Entry:

```
2026-09-09 15:40 WORKS  Build pages generated from Markdown
2026-09-09 16:12 BROKE  SSG crashed on framer-motion in the log view
  Any lines under an Entry are its detail. Markdown allowed.
2026-09-10 SHIPPED Live
```

Format: `DATE [TIME] TAG text`. Tags: TRIED, WORKS, BROKE, SHIPPED, PARKED, DEAD, NOTE.
Order in the file does not matter, the site sorts newest first.
The Build status is the latest SHIPPED, PARKED or DEAD Entry; with none it is Building.
