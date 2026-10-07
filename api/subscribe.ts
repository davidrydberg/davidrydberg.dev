/**
 * Newsletter signup. Adds the email as a Resend contact in the Newsletter
 * segment, with a record of the consent given. The only server code on the
 * site; see docs/adr/0002 and docs/adr/0003.
 */
const SEGMENT_ID = 'b2963e89-bd62-4db5-84e3-93ae83994f02';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = ['popup', 'home'];

// Keep in step with CONSENT_TEXT in src/components/Subscribe.tsx. Stored on
// the contact so there is a record of exactly what each person agreed to.
const CONSENT_TEXT =
  'Send me the newsletter by email. I can unsubscribe at any time. (privacy notice 2026-10-07)';

const resend = (method: string, path: string, body?: unknown) =>
  fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }

  // Bots fill every field; people never see this one. Pretend it worked.
  if (input.company) return Response.json({ ok: true });

  const address = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (address.length > 254 || !EMAIL_RE.test(address)) {
    return Response.json({ error: 'invalid email' }, { status: 400 });
  }
  // GDPR: no signup without an explicit, affirmative consent.
  if (input.consent !== true) {
    return Response.json({ error: 'consent required' }, { status: 400 });
  }

  const properties = {
    consent_at: new Date().toISOString(),
    consent_text: CONSENT_TEXT,
    consent_source: SOURCES.includes(input.source as string) ? (input.source as string) : 'unknown',
  };

  const created = await resend('POST', '/contacts', {
    email: address,
    unsubscribed: false,
    segments: [{ id: SEGMENT_ID }],
    properties,
  });
  if (created.ok) return Response.json({ ok: true });

  // Creating fails when the contact already exists. They just consented again,
  // so record that and add them to the segment.
  const path = `/contacts/${encodeURIComponent(address)}`;
  const updated = await resend('PATCH', path, { unsubscribed: false, properties });
  const added = updated.ok ? await resend('POST', `${path}/segments/${SEGMENT_ID}`) : updated;
  if (added.ok) return Response.json({ ok: true });

  console.error('subscribe failed', created.status, await created.text(), added.status, await added.text());
  return Response.json({ error: 'could not subscribe' }, { status: 502 });
}
