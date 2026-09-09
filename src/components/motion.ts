import type { CSSProperties } from 'react';

/** Style for a streamed list: --base is the delay in seconds before row 0. */
export const stream = (base: number): CSSProperties => ({ '--base': `${base}s` } as CSSProperties);

/** Style for one row in a streamed list. */
export const row = (i: number): CSSProperties => ({ '--i': i } as CSSProperties);
