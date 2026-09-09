import { Link, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SITE_NAME } from '../site';

/**
 * The single page shell: a one-line top bar, the page, a one-line footer.
 * Vercel Web Analytics is cookieless, so it loads without a consent gate.
 */
export const Layout = () => (
  <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8 text-[15px] leading-relaxed sm:px-8 sm:py-12">
    <header className="flex items-baseline justify-between gap-6 text-dim">
      <Link to="/" className="text-ink hover:text-accent">
        {SITE_NAME}
      </Link>
      <nav>
        <Link to="/builds" className="hover:text-ink">
          builds
        </Link>
      </nav>
    </header>
    <main className="flex-1 pt-14">
      <Outlet />
    </main>
    <footer className="pt-16 text-xs text-faint">work in progress, on purpose.</footer>
    <Analytics />
  </div>
);
