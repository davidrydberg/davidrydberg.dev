import type { Entry } from '../content/buildTypes';

/**
 * The Log: one entry per row, newest first, with the optional detail beneath.
 * Tags stay readable as words. Colour is not used to carry the meaning.
 */
export const Log = ({ entries }: { entries: Entry[] }) => {
  if (entries.length === 0) {
    return <p className="empty">no entries yet.</p>;
  }
  return (
    <ol className="log">
      {entries.map((e, i) => (
        <li key={i}>
          <div className="log-line">
            <time dateTime={e.time ? `${e.date}T${e.time}` : e.date} className="mono">
              {e.date}
              {e.time ? ` ${e.time}` : null}
            </time>
            <span className={`tag tag-${e.tag}`}>{e.tag}</span>
            <p className="log-text">{e.text}</p>
          </div>
          {e.detailHtml ? (
            <div className="prose prose-sm log-detail" dangerouslySetInnerHTML={{ __html: e.detailHtml }} />
          ) : null}
        </li>
      ))}
    </ol>
  );
};
