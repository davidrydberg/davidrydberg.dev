---
title: Dev portal
oneliner: Rebuilding my site into a portal to my work, in the open
started: 2026-09-09
links:
  - label: live
    url: https://davidrydberg.dev
---

## Why

I am starting to post about building with AI on TikTok, YouTube, X and LinkedIn.
Every post needs one link to point at.
The old site sold AI consulting to Swedish small businesses, which is not what the posts are about.
So it gets rebuilt as this: a landing page with my channels, and one living page per thing I build.

## Stack

Vite, React, TypeScript, Tailwind, vite-react-ssg for static HTML, Vercel for hosting.
Builds are Markdown files compiled at build time.
Written with Claude Code.

## Log

2026-09-09 NOTE Decided the site is a portal, not a consultancy page. Audience is builders like me: self-taught, business-minded, shipping with AI.
2026-09-09 TRIED Started from the old repo instead of a blank one. Kept the build pipeline and SEO plumbing, deleted every page.
2026-09-09 WORKS Log format: one line per entry, tag first, status derived from the latest SHIPPED, PARKED or DEAD line. No status field to forget.
2026-09-09 BROKE Considered pulling GitHub commits into the log. Nearly all my repos are private, so it would have shown commit counts and nothing else. Dropped it.
2026-09-09 NOTE Moved to its own repo. Goes live on davidrydberg.dev next; the old aiwithdavid.se stays up until it redirects here.
2026-09-09 NOTE TikTok and YouTube accounts do not exist yet. They show as "coming soon" until they do.
