---
status: accepted
date: 2026-09-09
---

# Pivot the site from Swedish small-business consultancy to a developer portal

The site at aiwithdavid.se was built for non-technical Swedish small-business owners (the pre-pivot site and glossary live in the frozen aiwithdavid repo).
David is starting to publish developer-focused content on TikTok, YouTube, X and LinkedIn, and needs one place to link to from all four.
We decided to rebuild this repo as that place: a portal to David's work and case studies, aimed at developers, moving to the domain davidrydberg.dev.

## Considered options

- Second property for developers, keep aiwithdavid.se as the consultancy site. Rejected: splits traffic driven from four channels and doubles maintenance.
- One site serving both audiences with separate entry points. Rejected: dilutes both messages.

## Consequences

- The Swedish småföretag positioning, identity sentence and AI-guide term are retired from this repo.
- The Portal lives in a new repo, davidrydberg.dev, on the domain davidrydberg.dev. The aiwithdavid repo is frozen as history; aiwithdavid.se should redirect to davidrydberg.dev.
- All pre-pivot content is removed from the site, not kept unlinked: the seven Swedish SEO guides, the Claude.ai series, the blog, booking and e-handel pages. Their Google rankings served the retired audience. Old URLs redirect to the Portal home. The files remain in the aiwithdavid repo. Decided 2026-09-09.
- Build Logs are hand-written. Pulling GitHub activity was rejected because nearly every repo is private, so it would show only commit counts. Aggregate Claude Code session stats per Build are planned as a later step.
