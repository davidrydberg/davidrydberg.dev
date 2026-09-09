import type { Entry } from '../content/buildTypes';
import { row, stream } from './motion';

/**
 * The Log rendered as a log: one monospace line per Entry, newest first,
 * with the optional detail beneath. Tag colours come from index.css.
 */
export const Log = ({ entries }: { entries: Entry[] }) => {
  if (entries.length === 0) {
    return <p className="text-faint">no entries yet.</p>;
  }
  return (
    <ol className="stream space-y-3" style={stream(0.3)}>
      {entries.map((e, i) => (
        <li key={i} style={row(i)}>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <span className="flex shrink-0 gap-3">
              <time dateTime={e.time ? `${e.date}T${e.time}` : e.date} className="text-faint">
                {e.date}
                {e.time ? ` ${e.time}` : null}
              </time>
              <span className={`tag tag-${e.tag}`}>{e.tag}</span>
            </span>
            <span className={`min-w-0 text-ink${i === entries.length - 1 ? ' cursor' : ''}`}>{e.text}</span>
          </div>
          {e.detailHtml ? (
            <div
              className="prose prose-sm mt-2 font-sans text-dim sm:pl-[24ch]"
              dangerouslySetInnerHTML={{ __html: e.detailHtml }}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
};
