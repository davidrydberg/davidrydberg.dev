import { Seo } from '../seo/Seo';
import { BUILDS } from '../content/builds.generated';
import { BuildRow } from '../components/BuildRow';
import { stream } from '../components/motion';

/** Every Build, newest update first. */
export const BuildsIndex = () => (
  <>
    <Seo route="/builds" />
    <h1 className="text-2xl font-medium">Builds</h1>
    <p className="mt-3 max-w-xl font-sans text-base text-dim">
      One living page per thing I build. Nothing here is finished. Each page is a log of what I
      tried, what works, and what broke.
    </p>
    <ul className="stream mt-10 space-y-3 sm:space-y-1" style={stream(0.2)}>
      {BUILDS.map((b, i) => (
        <BuildRow key={b.slug} build={b} index={i} />
      ))}
    </ul>
  </>
);
