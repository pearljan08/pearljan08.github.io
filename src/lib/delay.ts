import type { CSSProperties } from 'react';

/** Stagger helper for `[data-reveal]` and `.rise` animations. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
