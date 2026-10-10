export interface Role {
  id: string;
  company: string;
  title: string;
  /** Display range, e.g. "Jan 2022 — Aug 2024" */
  period: string;
  current?: boolean;
  client?: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface EarlierRole {
  company: string;
  title: string;
  period: string;
}

export interface Shot {
  src: string;
  caption: string;
  /** Intrinsic size, so the browser can reserve space before the image loads */
  width: number;
  height: number;
}

export interface Project {
  id: string;
  name: string;
  fullName: string;
  context: string;
  year: string;
  description: string;
  features: string[];
  stack: string[];
  cover: string;
  shots: Shot[];
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Link {
  label: string;
  href: string;
  display: string;
}
