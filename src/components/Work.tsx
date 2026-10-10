import { useState } from 'react';
import { projects } from '../data/profile';
import type { Project } from '../data/types';
import { delay } from '../lib/delay';
import Gallery from './Gallery';
import { ArrowUpRight, Expand } from './Icons';
import SectionHead from './SectionHead';

export default function Work() {
  const [open, setOpen] = useState<{ project: Project; index: number } | null>(null);

  return (
    <section id="work" className="shell py-20 sm:py-28">
      <SectionHead
        index="02"
        label="Selected work"
        title={
          <>
            Systems people <em className="text-accent">rely on</em>
          </>
        }
        aside="Production systems for a bank, a government commission and schools. Select a project to see its screens."
      />

      <ol className="space-y-20 sm:space-y-28">
        {projects.map((p, i) => (
          <li key={p.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-2' : ''}`} data-reveal>
              <div className="flex items-center gap-4">
                <img
                  src={p.cover}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-md border border-line object-cover"
                />
                <div>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, '0')} · {p.year}
                  </p>
                  <p className="mt-1 text-sm text-muted">{p.context}</p>
                </div>
              </div>

              <h3 className="mt-6 font-serif text-5xl leading-none tracking-tight sm:text-6xl">
                {p.name}
                <span className="mt-2 block font-sans text-base font-medium tracking-normal text-muted">
                  {p.fullName}
                </span>
              </h3>

              <p className="mt-6 leading-relaxed">{p.description}</p>

              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent" aria-hidden="true">
                      —
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech used">
                {p.stack.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setOpen({ project: p, index: 0 })}
                className="link mt-8 inline-flex items-center gap-1.5 font-mono text-sm"
              >
                View {p.shots.length} screen{p.shots.length > 1 ? 's' : ''}
                <ArrowUpRight />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen({ project: p, index: 0 })}
              className={`group block w-full text-left lg:col-span-7 ${i % 2 ? 'lg:order-1' : ''}`}
              aria-label={`Open ${p.name} screenshots`}
              data-reveal
              style={delay(120)}
            >
              <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="ml-3 truncate font-mono text-[0.7rem] text-muted">
                    {p.name.toLowerCase()} / {p.shots[0].caption.toLowerCase()}
                  </span>
                  <Expand className="ml-auto shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="overflow-hidden bg-white">
                  <img
                    src={p.shots[0].src}
                    alt={`${p.fullName}: ${p.shots[0].caption}`}
                    width={p.shots[0].width}
                    height={p.shots[0].height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </button>
          </li>
        ))}
      </ol>

      <Gallery
        project={open?.project ?? null}
        index={open?.index ?? 0}
        onIndex={(index) => setOpen((o) => (o ? { ...o, index } : o))}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
