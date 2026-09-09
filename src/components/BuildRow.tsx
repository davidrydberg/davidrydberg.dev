import { Link } from 'react-router-dom';
import type { Build } from '../content/buildTypes';
import { row } from './motion';

/** One line per Build in a listing: name, status, last update, one-liner. */
export const BuildRow = ({ build, index = 0 }: { build: Build; index?: number }) => (
  <li
    className="grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-1 sm:grid-cols-[12ch_11ch_11ch_minmax(0,1fr)]"
    style={row(index)}
  >
    <Link to={build.path} className="truncate text-ink underline-offset-4 hover:underline">
      {build.slug}
    </Link>
    <span className={`dot status-${build.status}`}>{build.status.toUpperCase()}</span>
    <time dateTime={build.updated} className="text-faint">
      {build.updated}
    </time>
    <span className="text-dim">{build.oneliner}</span>
  </li>
);
