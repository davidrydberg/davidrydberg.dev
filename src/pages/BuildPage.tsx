import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';
import { Log } from '../components/Log';
import type { Build } from '../content/buildTypes';
import { SITE_NAME, SITE_URL } from '../site';

const Section = ({ title, html }: { title: string; html: string }) =>
  html ? (
    <section className="build-section">
      <h2 className="section-kicker mono">{title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  ) : null;

/** One Build: header, Why, Stack, then the Log. */
export const BuildPage = ({ build }: { build: Build }) => (
  <div className="page">
    <div className="wrap">
      <Seo
        meta={{
          title: `${build.title} | ${SITE_NAME}`,
          description: build.oneliner,
          canonical: `${SITE_URL}${build.path}`,
        }}
      />
      <p className="crumb mono">
        <Link to="/builds">builds</Link>
        {' / '}
        {build.slug}
      </p>
      <h1>{build.title}</h1>
      <p className="lede">{build.oneliner}</p>

      <dl className="facts">
        <dt>status</dt>
        <dd className="status mono" data-status={build.status}>{build.status}</dd>
        <dt>started</dt>
        <dd>
          <time dateTime={build.started}>{build.started}</time>
        </dd>
        <dt>updated</dt>
        <dd>
          <time dateTime={build.updated}>{build.updated}</time>
        </dd>
        {build.links.length > 0 ? (
          <>
            <dt>links</dt>
            <dd className="fact-links">
              {build.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ))}
            </dd>
          </>
        ) : null}
      </dl>

      <Section title="why" html={build.whyHtml} />
      <Section title="stack" html={build.stackHtml} />

      <section className="build-section">
        <h2 className="section-kicker mono">log</h2>
        <Log entries={build.log} />
      </section>
    </div>
  </div>
);
