import { useEffect, useState } from 'react';
import { CHANNELS } from '../site';

const GITHUB_URL = CHANNELS.find((channel) => channel.key === 'github')?.url;

type ContributionsCount = { count: number; year: number };

const isCount = (value: unknown): value is ContributionsCount => {
  if (!value || typeof value !== 'object') return false;
  const { count, year } = value as ContributionsCount;
  return Number.isInteger(count) && count > 0 && Number.isInteger(year) && year >= 2000 && year <= 9999;
};

const formatCount = (count: number) => String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * One quiet line: public GitHub contributions in the current Stockholm year.
 * The token stays on the server. A missing token, a bad payload, or a zero
 * count removes the line. Nothing here renders 0, NaN, or an error.
 */
export const Contributions = () => {
  const [data, setData] = useState<ContributionsCount | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!GITHUB_URL) {
      setHidden(true);
      return;
    }

    const controller = new AbortController();
    fetch('/api/github-contributions', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('unavailable'))))
      .then((body: unknown) => {
        if (isCount(body)) setData(body);
        else setHidden(true);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setHidden(true);
      });

    return () => controller.abort();
  }, []);

  if (hidden || !GITHUB_URL) return null;

  return (
    <p className="contributions" aria-live="polite" aria-busy={data ? undefined : true}>
      {data ? (
        <a href={GITHUB_URL} target="_blank" rel="me noopener noreferrer">
          {formatCount(data.count)} contributions on GitHub in {data.year}
        </a>
      ) : null}
    </p>
  );
};
