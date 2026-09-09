import { Seo } from '../seo/Seo';
import { BUILDS } from '../content/builds.generated';
import { BuildRow } from '../components/BuildRow';
import { Prompt } from '../components/Prompt';
import { ChannelIcon } from '../components/ChannelIcon';
import { row, stream } from '../components/motion';
import { CHANNELS, EMAIL, IDENTITY_LINE, SITE_NAME, SITE_URL } from '../site';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#david`,
  name: SITE_NAME,
  description: IDENTITY_LINE,
  url: `${SITE_URL}/`,
  email: EMAIL,
  sameAs: CHANNELS.flatMap((c) => (c.url ? [c.url] : [])),
};

/**
 * The landing page: who David is, where he posts, what he is building, how to
 * reach him. Reads like a shell session because the site is a workbench.
 */
export const Home = () => (
  <>
    <Seo route="/" jsonLd={personJsonLd} />
    <div className="stream" style={stream(0)}>
      <h1 className="text-2xl font-medium" style={row(0)}>{SITE_NAME}</h1>
      <p className="mt-3 max-w-xl font-sans text-base text-dim" style={row(1)}>{IDENTITY_LINE}</p>
    </div>

    <section className="mt-14">
      <Prompt text="ls channels/" delay={0.2} />
      <ul className="stream mt-3 space-y-1" style={stream(0.7)}>
        {CHANNELS.map((c, i) => (
          <li key={c.key} className="flex items-center gap-4" style={row(i)}>
            {c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-4 text-ink underline-offset-4 hover:underline"
              >
                <ChannelIcon channel={c.key} className="text-dim transition-colors group-hover:text-accent" />
                {c.handle}
              </a>
            ) : (
              <span className="flex items-center gap-4 text-faint">
                <ChannelIcon channel={c.key} />
                {c.handle}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-14">
      <Prompt text="ls builds/" delay={1.1} />
      <ul className="stream mt-3 space-y-3 sm:space-y-1" style={stream(1.6)}>
        {BUILDS.map((b, i) => (
          <BuildRow key={b.slug} build={b} index={i} />
        ))}
      </ul>
    </section>

    <section className="mt-14">
      <Prompt text="cat contact" delay={1.9} />
      <p className="stream mt-3" style={stream(2.4)}>
        <a href={`mailto:${EMAIL}`} className="cursor text-ink underline-offset-4 hover:underline">
          {EMAIL}
        </a>
      </p>
    </section>
  </>
);
