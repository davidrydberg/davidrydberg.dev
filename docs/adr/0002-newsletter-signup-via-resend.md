---
status: accepted
date: 2026-10-07
---

# Newsletter signup through Resend and one Vercel function

The Portal needs a way for visitors to sign up for email about new Builds and Entries.
David already uses Resend for agent email, so the list lives there as the Newsletter segment and is sent with Resend Broadcasts.

## Considered options

- Hosted signup form or embed from a newsletter service. Rejected: a third-party look on a hand-built site, and a second email vendor.
- Resend contacts written from a Vercel function. Chosen: keeps the static site, adds one small function, no new dependency.

## Consequences

- `api/subscribe.ts` is the first server code in the repo. The site stays static otherwise.
- `RESEND_API_KEY` must be set in Vercel. The key needs full access, since sending-only keys cannot write contacts.
- The segment ID is hard-coded in the function. It is not a secret.
- Signup is single opt-in with a honeypot field against bots. Revisit with double opt-in if spam signups show up.
- `npm run dev` does not serve `/api`. Test the form with `vercel dev` or on a preview deploy.
