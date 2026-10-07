---
status: accepted
date: 2026-10-07
---

# GDPR consent for the newsletter, and a signup popup on the home page

David wants the newsletter signup to appear as a popup on the home page, and to be GDPR safe.

## Decision

- The popup is a corner card that slides in 4 seconds after load, not a page-blocking modal. It shows once per visitor: closing it or subscribing sets a localStorage flag.
- Every signup form has a required consent checkbox, unticked by default, linking to a privacy notice at `/privacy`.
- The API rejects any signup without `consent: true`, and stores `consent_at`, `consent_text` and `consent_source` on the Resend contact as the record of consent.
- Signing up again with an existing address records the new consent and resubscribes it.

## Considered options

- Full-screen modal on load. Rejected: blocks the page, and search engines penalise intrusive interstitials on mobile.
- Double opt-in with a confirmation email. Deferred: not required by GDPR when consent is explicit and recorded, and it needs a verified newsletter sending domain first. Revisit if fake signups show up.

## Consequences

- The localStorage flag is treated as strictly necessary for a feature the visitor used, so there is no cookie banner.
- When the privacy notice wording changes, update its date and the `consent_text` constant in `api/subscribe.ts`.
- The Resend contact properties `consent_at`, `consent_text` and `consent_source` must exist in Resend. They were created 2026-10-07.
