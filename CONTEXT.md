# David Rydberg Dev Portal

The language for davidrydberg.dev: David Rydberg's portal to his work and case studies, aimed at Builders: self-taught people who ship software with AI.
Supersedes the AI With David consultancy glossary (retired 2026-09-09, see docs/adr/0001).

## Language

**Builder**:
A self-taught, business-minded person who ships real software through AI-assisted development; David is one, and Builders are the audience.
_Avoid_: software engineer, senior developer, developer (as the audience), AI-konsult, AI-guide

**Identity line**:
"Founder building with AI all day. Agents, automations, code, experiments. I share what I'm trying, what works, and what breaks." Used verbatim wherever David is introduced.
_Avoid_: paraphrasing it, "self-taught" in the line itself, consultant, AI-guide

**AI-assisted development**:
David's way of working: he directs AI coding tools (Claude Code, agents, skills) and owns the decisions, rather than hand-writing most code.
_Avoid_: vibe coding, no-code

**Portal**:
The site itself: one link that every channel (TikTok, YouTube, X, LinkedIn) points to, from which everything David makes is reachable; built for fun, openly a work in progress.
_Avoid_: landing page, blog, consultancy site, product

**Build with me**:
The stance of the Portal: David shows what is possible with AI by showing how he actually did it, imperfections included, while it is still happening.
_Avoid_: polished showcase, portfolio, thought leadership

**Build**:
A living page for one project: what it is, its current state, what was done with AI, what broke, and links to its videos and repo; updated as the project moves, never marked finished.
_Avoid_: case study, project page, portfolio item, write-up

**Log**:
The heart of a Build: dated entries, newest first, each recording what was tried, what worked, and what broke.
_Avoid_: changelog, updates, blog, timeline

**Entry**:
One dated, tagged line in a Build's Log (tags: TRIED, WORKS, BROKE, SHIPPED, PARKED, DEAD, NOTE), optionally with a short detail beneath; hand-written by David, or generated from the public daily logs in a **Showcase Build**.
_Avoid_: post, update, commit, activity

**Build status**:
One of Building (actively worked on), Shipped (in real use, still updated), Parked (not touched now, not dead), Dead (abandoned, kept for what broke).
_Avoid_: done, finished, complete, archived

**Daily log**:
One day of David's GitHub activity, summarised in the private repo davidrydberg/logs; its public version (`public/`, clients anonymised) is the only part the Portal reads.
_Avoid_: changelog, activity feed, commit history

**Showcase Build**:
A **Build** generated from the public **Daily logs** (frontmatter `source: logs`): one thing David built that a Builder learns from, never one Build per repo or per day; proposed as a PR, published only when David merges it.
_Avoid_: auto-post, feed, recap

**Session stats**:
Aggregate counts of David's Claude Code sessions for one Build (sessions, tool calls, reverts), shown on the Build as proof of AI-assisted development; never content from the sessions.
_Avoid_: analytics, telemetry, activity feed

**Channel**:
One of the places David posts: TikTok, YouTube, X, LinkedIn, plus GitHub (davidrydberg) as the code channel; all five are linked from the Portal home.
_Avoid_: social, platform, socials

**Newsletter**:
Email to people who signed up on the Portal, sent through Resend when a new Build or a notable Entry lands; no fixed schedule.
_Avoid_: updates, digest, mailing list

## Relationships

- A **Build** has exactly one **Log**; its **Build status** is derived from the latest SHIPPED, PARKED or DEAD **Entry**, defaulting to Building.
- A **Log** has many **Entries**; an **Entry** belongs to exactly one **Build**.

- The **Portal** is the single link target for every channel.
- **Build with me** governs every page of the **Portal**: nothing is presented as finished.
- The **Portal** contains many **Builds**; the Portal hosts no video feed of its own, videos live on the **Channels**.
- Every **Channel** is linked from the Portal home; the Portal is the only link every **Channel** points back to.

## Example dialogue

> **Dev:** "The Lampgrossen page is finished, should I mark it complete?"
> **Domain expert:** "Nothing is complete. It is **Shipped**, and the next **Entry** goes in its **Log** the day something breaks."

## Flagged ambiguities

- GitHub commit activity as Log content was considered and rejected 2026-09-09: repos are private, so it degrades to counts, which is filler. Revisited 2026-10-09: the **Daily logs** summarise what was built, not counts, so **Showcase Builds** are generated from their public version (docs/adr/0004).

- Named clients allowed on the Portal: Lampgrossen, BIBBI. Any other client is anonymised, and **Showcase Builds** anonymise every client. Changed 2026-10-09.
- TikTok and YouTube handles are not created yet (aiwithdavid handles are retired); X (davrydb) and LinkedIn (davidrydb) stand. Open.
- First **Build** to publish is undecided; the Portal ships as a skeleton with the Build structure in place.

- "developer" was used for the audience - resolved 2026-09-09: the audience is **Builders**, not engineers evaluating AI tools. Credibility comes from proof of shipping, not engineering seniority.
