import { useEffect, useState } from 'react';
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
 * Newsletter signup that slides in on the home page, once per visitor. A
 * corner card, not a page-blocking modal, so the page stays usable.
 */
export const SubscribePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Treat blocked storage as not seen.
    }
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    markSeen();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      markSeen();
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="subscribe-popup-title"
      className="popup fixed inset-x-3 bottom-3 z-50 border border-line bg-panel p-5 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="subscribe-popup-title" className="text-dim">
          <span className="text-faint">$ </span>subscribe
        </h2>
        <button onClick={close} aria-label="Close" className="text-faint hover:text-ink">
          [x]
        </button>
      </div>
      <div className="mt-3">
        <Subscribe source="popup" onSubscribed={markSeen} />
      </div>
    </div>
  );
};
