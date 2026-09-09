import type { CSSProperties } from 'react';

/**
 * A shell prompt heading that types itself in. `delay` staggers sections so
 * the page reads top to bottom like a session replaying.
 */
export const Prompt = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <h2 className="text-dim">
    <span className="text-faint">$ </span>
    <span
      className="typed"
      style={{ '--n': text.length, '--delay': `${delay}s` } as CSSProperties}
    >
      {text}
    </span>
  </h2>
);
