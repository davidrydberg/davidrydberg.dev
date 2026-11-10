import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';
import { Contributions } from '../components/Contributions';
import { SubscribePopup } from '../components/SubscribePopup';
import { HOME_BUILDS, SELECTED_WORK, type HomeBuild } from '../content/home';
import { CHANNELS, EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../site';

const HERO_LINKS = [
  { key: 'github', label: 'GitHub' },
  { key: 'x', label: 'X' },
  { key: 'linkedin', label: 'LinkedIn' },
] as const;

const BUILD_FILTERS = ['All', ...new Set(HOME_BUILDS.map((build) => build.status))];

/** What the About copy says surrounds the model. */
const HARNESS = ['prompts', 'tools', 'evals', 'gates', 'review loops'];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#david`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  email: EMAIL,
  sameAs: CHANNELS.flatMap((c) => (c.url ? [c.url] : [])),
};

const BuildName = ({ build }: { build: HomeBuild }) =>
  build.external ? (
    <a className="name" href={build.href} target="_blank" rel="noopener noreferrer">
      {build.name}
    </a>
  ) : (
    <Link className="name" to={build.href}>
      {build.name}
    </Link>
  );

/**
 * The portal home: who David is, selected work, public builds, about, contact.
 */
export const Home = () => {
  const [subscribeRequest, setSubscribeRequest] = useState(0);
  const [buildFilter, setBuildFilter] = useState('All');

  const shownBuilds = HOME_BUILDS.filter(
    (build) => buildFilter === 'All' || build.status === buildFilter,
  );

  const openNewsletter = () => setSubscribeRequest((n) => n + 1);

  return (
    <>
      <Seo route="/" jsonLd={personJsonLd} />
      <SubscribePopup openRequest={subscribeRequest} />

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <p className="kicker">
              Portal / work in progress, on purpose
              <span className="cursor" aria-hidden="true" />
            </p>
            <h1>
              <span className="h1-name">{SITE_NAME}</span>
              <span className="h1-line">I'm a self-taught builder in Malmö.</span>
            </h1>
            <p className="sub">
              I code every day, mostly with AI, and keep a public log of what works and what breaks.
            </p>
            <ul className="hero-links" aria-label="Channels">
              {HERO_LINKS.map((item) => {
                const channel = CHANNELS.find((c) => c.key === item.key);
                if (!channel?.url) return null;
                return (
                  <li key={item.key}>
                    <a href={channel.url} target="_blank" rel="me noopener noreferrer">
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="ctas">
              <a className="email-link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
            <Contributions />
          </div>
        </div>
      </section>

      <section className="block" id="work" aria-labelledby="work-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-kicker mono">01 / Work</p>
              <h2 id="work-heading">Selected work</h2>
            </div>
            <p className="section-note">An overview.</p>
          </div>
          <ul className="work">
            {SELECTED_WORK.map((item, i) => (
              <li key={item.title}>
                <span className="work-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="work-top">
                  <p className="context">{item.context}</p>
                  {item.when ? <time dateTime={item.when}>{item.when}</time> : null}
                </div>
                <h3>{item.title}</h3>
                <p className="what">{item.what}</p>
                <div className="meta">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block tinted" id="builds" aria-labelledby="builds-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-kicker mono">02 / Builds</p>
              <h2 id="builds-heading">Builds & public tools</h2>
            </div>
            <div className="filters" role="group" aria-label="Filter builds by status">
              {BUILD_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="filter"
                  aria-pressed={filter === buildFilter}
                  onClick={() => setBuildFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <ul className="builds">
            {shownBuilds.map((build) => (
              <li className="build" key={build.name}>
                <BuildName build={build} />
                <span className="status mono" data-status={build.status}>{build.status}</span>
                <span className="desc">{build.description}</span>
                {build.repo ? (
                  <span className="end">
                    <a href={build.repo} target="_blank" rel="noopener noreferrer">
                      repo
                    </a>
                  </span>
                ) : build.updated ? (
                  <time className="end mono" dateTime={build.updated}>
                    {build.updated}
                  </time>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" id="about" aria-labelledby="about-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-kicker mono">03 / About</p>
              <h2 id="about-heading">About</h2>
            </div>
          </div>
          <div className="about-grid">
            <div className="about">
              <p>
                I'm a self-taught builder in Sweden. I code every day, and I do most of that work with
                AI agents beside me. It isn't a demo. It's how the work gets done.
              </p>
              <p className="belief">
                Core belief: it isn't the model, it's the harness. The prompts, tools, evals, gates and
                review loops around the model are what make something shippable.
              </p>
              <p>The build logs on this site are that record: what works, and what breaks.</p>
            </div>
            <ul className="harness" aria-label="The harness">
              {HARNESS.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="block" id="contact" aria-labelledby="contact-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-kicker mono">04 / Contact</p>
              <h2 id="contact-heading">Get in touch.</h2>
            </div>
          </div>
          <div className="contact">
            <p className="lead">
              If a repetitive workflow is slowing your team down, email me. I'll tell you whether an
              agent can take it.
            </p>
            <a className="email-big" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <p className="newsletter">
              Want new builds by email?{' '}
              <a href="#newsletter" onClick={(event) => { event.preventDefault(); openNewsletter(); }}>
                Subscribe
              </a>
              {'. No schedule, unsubscribe any time.'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
