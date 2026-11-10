import { Link } from 'react-router-dom';
import type { Build } from '../content/buildTypes';

/** One Build in a listing: name, status, one-liner, last update. */
export const BuildRow = ({ build }: { build: Build }) => (
  <li className="build">
    <Link to={build.path} className="name">
      {build.slug}
    </Link>
    <span className="status mono" data-status={build.status}>{build.status}</span>
    <span className="desc">{build.oneliner}</span>
    <time dateTime={build.updated} className="end mono">
      {build.updated}
    </time>
  </li>
);
