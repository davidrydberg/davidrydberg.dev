/**
 * Newsletter signup. Adds the email as a Resend contact in the Newsletter
 * segment. The only server code on the site; see docs/adr/0002.
 */
const SEGMENT_ID = 'b2963e89-bd62-4db5-84e3-93ae83994f02';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = (path: string, body?: unknown) =>
  fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export async function POST(request: Request) {
  let email: unknown;
  let honeypot: unknown;
  try {
    ({ email, company: honeypot } = (await request.json()) as Record<string, unknown>);
  } catch {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }

  // Bots fill every field; people never see this one. Pretend it worked.
  if (honeypot) return Response.json({ ok: true });

  const address = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (address.length > 254 || !EMAIL_RE.test(address)) {
    return Response.json({ error: 'invalid email' }, { status: 400 });
  }

  const created = await resend('/contacts', {
    email: address,
    unsubscribed: false,
    segments: [{ id: SEGMENT_ID }],
  });
  if (created.ok) return Response.json({ ok: true });

  // Creating fails when the contact already exists; add it to the segment instead.
  const added = await resend(`/contacts/${encodeURIComponent(address)}/segments/${SEGMENT_ID}`);
  if (added.ok) return Response.json({ ok: true });

  console.error('subscribe failed', created.status, await created.text(), added.status, await added.text());
  return Response.json({ error: 'could not subscribe' }, { status: 502 });
}
