import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { EMAIL, SITE_NAME } from '../site';

/**
 * Scrolls to the hash target after a navigation, and to the top otherwise.
 * CSS scroll-behavior covers the motion, and turns it off for reduced motion.
 */
const HashScroll = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }, [pathname, hash]);

  return null;
};

/**
 * Site chrome shared by every route: nav, page, footer.
 * Vercel Web Analytics is cookieless, so it loads without a consent gate.
 */
export const Layout = () => {
  const { pathname } = useLocation();

  return (
    <>
      <HashScroll />
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="site">
        <div className="wrap">
          <div className="nav">
            <Link
              to="/"
              className="brand"
              onClick={() => {
                if (pathname === '/') window.scrollTo(0, 0);
              }}
            >
              <span className="brand-dot" aria-hidden="true" />
              {SITE_NAME}
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <Link to="/#work">Work</Link>
              <Link to="/#builds">Builds</Link>
              <Link to="/#about">About</Link>
              <Link to="/#contact">Contact</Link>
              <a className="nav-cta" href={`mailto:${EMAIL}`}>
                Email
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="site">
        <div className="wrap footer-inner">
          <span>work in progress, on purpose.</span>
          <Link to="/privacy">privacy</Link>
        </div>
      </footer>
      <Analytics />
    </>
  );
};
