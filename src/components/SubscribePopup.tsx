import { useEffect, useRef, useState } from 'react';
import { Subscribe } from './Subscribe';

// Remembers that this visitor closed the popup or subscribed, so it shows once.
// Strictly necessary for the feature the visitor used, so no consent gate.
const SEEN_KEY = 'newsletter-popup-seen';
const DELAY_MS = 4000;

const markSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: the popup may show again next visit. Harmless.
  }
};

/**
 * Newsletter signup that slides in on the home page, once per visitor.
 * A corner card, not a page-blocking modal, so the page stays usable.
 * `openRequest` increments when the contact link asks for it now.
 */
export const SubscribePopup = ({ openRequest }: { openRequest: number }) => {
  const [open, setOpen] = useState(false);
  const seen = useRef(false);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      seen.current = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Treat blocked storage as not seen.
    }
    if (seen.current) return;
    const timer = setTimeout(() => {
      if (!seen.current) setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openRequest < 1) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
    const timer = window.setTimeout(() => {
      document.getElementById('subscribe-email-popup')?.focus();
    }, 30);
    return () => clearTimeout(timer);
  }, [openRequest]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      seen.current = true;
      markSeen();
      setOpen(false);
      opener.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => {
    seen.current = true;
    markSeen();
    setOpen(false);
    opener.current?.focus();
  };

  if (!open) return null;

  return (
    <div
      id="newsletter"
      role="dialog"
      aria-labelledby="subscribe-popup-title"
      aria-modal="false"
      className="popup"
    >
      <div className="popup-head">
        <h2 id="subscribe-popup-title">Subscribe</h2>
        <button type="button" onClick={close} className="popup-close">
          Close
        </button>
      </div>
      <Subscribe source="popup" onSubscribed={markSeen} />
    </div>
  );
};
