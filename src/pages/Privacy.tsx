import { Seo } from '../seo/Seo';
import { EMAIL } from '../site';

/**
 * Privacy notice for the newsletter and the site. GDPR Articles 13 and 14:
 * who, what, why, legal basis, processors, retention, rights. Date it when the
 * wording changes, and update CONSENT_TEXT in api/subscribe.ts to match.
 */
export const Privacy = () => (
  <>
    <Seo route="/privacy" />
    <h1 className="text-2xl font-medium">Privacy</h1>
    <p className="mt-2 text-sm text-faint">Last updated 2026-10-07</p>
    <div className="prose mt-8 max-w-2xl font-sans">
      <h2>Who is responsible</h2>
      <p>
        David Rydberg, Sweden, is the data controller for this site and its newsletter. Contact:{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>The newsletter</h2>
      <p>
        If you subscribe, I store your email address, the time you subscribed, which form you used, and
        the consent text you agreed to. I use it only to send you the newsletter. I do not sell it or share
        it with anyone except the email service below.
      </p>
      <p>
        The legal basis is your consent (GDPR Article 6(1)(a)). You can withdraw it at any time with the
        unsubscribe link in every email, or by emailing me.
      </p>
      <p>
        When you unsubscribe, I keep your address marked as unsubscribed so you are not emailed again. If
        you want it deleted completely, email me and I will delete it.
      </p>

      <h2>Services that process data for me</h2>
      <ul>
        <li>
          <strong>Resend</strong> stores the subscriber list and sends the newsletter, acting as my processor
          under its data processing agreement. Data may be processed outside the EU/EEA, protected by the
          safeguards in that agreement.
        </li>
        <li>
          <strong>Vercel</strong> hosts the site. Like any web host, it processes technical request data such
          as IP addresses to serve pages and keep the site secure.
        </li>
        <li>
          <strong>Vercel Web Analytics</strong> counts page views without cookies and without identifying
          you.
        </li>
      </ul>

      <h2>Cookies and storage</h2>
      <p>
        This site sets no cookies. If you close the newsletter popup or subscribe, your browser stores a
        single flag so the popup does not show again. It holds no personal data.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask for a copy of your data, have it corrected or deleted, restrict or object to its use,
        and take it elsewhere. Email me and I will answer within a month. You can also complain to the
        Swedish Authority for Privacy Protection (IMY), <a href="https://www.imy.se">imy.se</a>.
      </p>
    </div>
  </>
);
