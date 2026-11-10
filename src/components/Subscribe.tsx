import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

type State = 'idle' | 'sending' | 'ok' | 'error';

// Keep in step with CONSENT_TEXT in api/subscribe.ts, which stores it on the contact.
const CONSENT_TEXT = 'Send me the newsletter by email. I can unsubscribe at any time.';

/**
 * Newsletter signup. Posts to api/subscribe, which adds the address to the
 * Resend Newsletter segment. The consent box is unticked by default and
 * required, and the privacy notice is one click away.
 */
export const Subscribe = ({
  source,
  onSubscribed,
}: {
  source: 'popup';
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
    return (
      <p className="form-ok" role="status">
        You are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="subscribe">
      <p id="subscribe-blurb" className="subscribe-blurb">
        New Builds and Log Entries by email. No schedule, unsubscribe any time.
      </p>
      <div className="subscribe-row">
        <label htmlFor={`subscribe-email-${source}`} className="sr-only">
          Email
        </label>
        <input
          id={`subscribe-email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="subscribe-input"
        />
        <button type="submit" disabled={state === 'sending'} className="subscribe-button">
          {state === 'sending' ? 'Sending...' : 'Subscribe'}
        </button>
      </div>
      <label className="consent">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          {CONSENT_TEXT} See the <Link to="/privacy">privacy notice</Link>.
        </span>
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state === 'error' && (
        <p className="form-error" role="alert">
          That did not work. Try again, or email me.
        </p>
      )}
    </form>
  );
};
