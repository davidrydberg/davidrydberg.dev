import { Seo } from '../seo/Seo';
import { BUILDS } from '../content/builds.generated';
import { BuildRow } from '../components/BuildRow';

/** Every Build, newest update first. */
export const BuildsIndex = () => (
  <div className="page">
    <div className="wrap">
      <Seo route="/builds" />
      <h1>Builds</h1>
      <p className="lede">
        One living page per thing I build. Nothing here is finished. Each page is a log of what I
        tried, what works, and what broke.
      </p>
      <ul className="builds page-builds">
        {BUILDS.map((b) => (
          <BuildRow key={b.slug} build={b} />
        ))}
      </ul>
    </div>
  </div>
);
