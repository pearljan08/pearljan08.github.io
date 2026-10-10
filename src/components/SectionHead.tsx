import type { ReactNode } from 'react';
import { delay } from '../lib/delay';

interface Props {
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
}

export default function SectionHead({ index, label, title, aside }: Props) {
  return (
    <header className="mb-12 sm:mb-16">
      <div className="flex items-baseline gap-4 border-t border-line pt-5" data-reveal>
        <span className="eyebrow text-accent!">{index}</span>
        <span className="eyebrow">{label}</span>
      </div>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2
          className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight"
          data-reveal
          style={delay(80)}
        >
          {title}
        </h2>
        {aside && (
          <div className="max-w-sm text-muted" data-reveal style={delay(160)}>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
