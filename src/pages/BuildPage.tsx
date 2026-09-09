import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';
import { Log } from '../components/Log';
import type { Build } from '../content/buildTypes';
import { SITE_NAME, SITE_URL } from '../site';

const Section = ({ title, html }: { title: string; html: string }) =>
  html ? (
    <section className="mt-12">
      <h2 className="text-dim">{title}</h2>
      <div className="prose mt-3 font-sans" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  ) : null;

/** One Build: header, Why, Stack, then the Log, which is where the page lives. */
export const BuildPage = ({ build }: { build: Build }) => (
  <>
    <Seo
      meta={{
        title: `${build.title} | ${SITE_NAME}`,
        description: build.oneliner,
        canonical: `${SITE_URL}${build.path}`,
      }}
    />
    <p className="text-faint">
      <Link to="/builds" className="hover:text-ink">
        builds
      </Link>{' '}
      / {build.slug}
    </p>
    <h1 className="mt-4 text-2xl font-medium">{build.title}</h1>
    <p className="mt-2 max-w-xl font-sans text-base text-dim">{build.oneliner}</p>

    <dl className="mt-6 grid grid-cols-[9ch_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
      <dt className="text-faint">status</dt>
      <dd className={`dot status-${build.status}`}>{build.status.toUpperCase()}</dd>
      <dt className="text-faint">started</dt>
      <dd>{build.started}</dd>
      <dt className="text-faint">updated</dt>
      <dd>{build.updated}</dd>
      {build.links.length > 0 ? (
        <>
          <dt className="text-faint">links</dt>
          <dd className="flex flex-wrap gap-4">
            {build.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            ))}
          </dd>
        </>
      ) : null}
    </dl>

    <Section title="why" html={build.whyHtml} />
    <Section title="stack" html={build.stackHtml} />

    <section className="mt-12">
      <h2 className="text-dim">log</h2>
      <div className="mt-4">
        <Log entries={build.log} />
      </div>
    </section>
  </>
);
