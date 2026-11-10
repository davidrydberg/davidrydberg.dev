import { useEffect, useRef, useState } from 'react';
import { Subscribe } from './Subscribe';

// Remembers that this visitor closed the bar or subscribed, so the
// unsolicited bar shows once. Strictly necessary for the feature the
// visitor used, so no consent gate. The Contact link can still open it.
const SEEN_KEY = 'newsletter-popup-seen';

// Phones and small tablets. The bar never opens itself at this width.
const SMALL_SCREEN = '(max-width: 720px)';

const markSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: the bar may show again next visit. Harmless.
  }
};

/**
 * Newsletter signup on the home page.
 * A compact bar along the bottom, not a card over the hero.
 * It does not open on a timer. On a small screen it stays closed until
 * the Contact link asks. On a wider screen it opens once the visitor
 * has scrolled near the bottom and the hero has left the screen.
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

    const small = window.matchMedia(SMALL_SCREEN);

    const onScroll = () => {
      if (seen.current || small.matches) return;
      if (window.scrollY < 240) return;
      const hero = document.querySelector('.hero');
      if (hero instanceof HTMLElement && hero.getBoundingClientRect().bottom > 0) return;
      const remaining = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (remaining > 320) return;
      setOpen(true);
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <div className="wrap">
        <div className="popup-head">
          <h2 id="subscribe-popup-title">Subscribe</h2>
          <button type="button" onClick={close} className="popup-close">
            Close
          </button>
        </div>
        <Subscribe source="popup" onSubscribed={markSeen} />
      </div>
    </div>
  );
};
