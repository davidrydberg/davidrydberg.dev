import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

type State = 'idle' | 'sending' | 'ok' | 'error';

// Keep in step with CONSENT_TEXT in api/subscribe.ts, which stores it on the contact.
const CONSENT_TEXT = 'Send me the newsletter by email. I can unsubscribe at any time.';

/**
 * Newsletter signup, styled as a shell input. Posts to api/subscribe, which
 * adds the address to the Resend Newsletter segment. GDPR: the consent box is
 * unticked by default and required, and the privacy notice is one click away.
 */
export const Subscribe = ({
  source,
  onSubscribed,
}: {
  source: 'popup' | 'home';
  onSubscribed?: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('sending');
    const company = new FormData(e.currentTarget).get('company');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source, company }),
      });
      setState(res.ok ? 'ok' : 'error');
      if (res.ok) onSubscribed?.();
    } catch {
      setState('error');
    }
  };

  if (state === 'ok') {
    return <p className="text-accent">ok. you are on the list.</p>;
  }

  return (
    <form onSubmit={submit} className="max-w-xl">
      <p className="font-sans text-dim">New Builds and Log Entries by email. No schedule, unsubscribe any time.</p>
      <div className="mt-3 flex items-center gap-3 border-b border-line focus-within:border-accent">
        <span className="text-accent" aria-hidden="true">&gt;</span>
        <label htmlFor={`subscribe-email-${source}`} className="sr-only">Email</label>
        <input
          id={`subscribe-email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="text-dim hover:text-accent disabled:text-faint"
        >
          {state === 'sending' ? 'sending...' : 'subscribe'}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-3 font-sans text-sm text-dim">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[#8fe3a8]"
        />
        <span>
          {CONSENT_TEXT} See the{' '}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-ink">
            privacy notice
          </Link>
          .
        </span>
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state === 'error' && <p className="mt-2 text-[#f2a37a]">error: that did not work. try again, or email me.</p>}
    </form>
  );
};
