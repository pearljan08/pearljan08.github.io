import { earlier, roles } from '../data/profile';
import { delay } from '../lib/delay';
import SectionHead from './SectionHead';

export default function Experience() {
  return (
    <section id="experience" className="shell py-20 sm:py-28">
      <SectionHead
        index="03"
        label="Experience"
        title={
          <>
            Where I’ve <em className="text-accent">shipped</em>
          </>
        }
        aside="Banking, SaaS security and education. Most of it fullstack, some of it running the deployments."
      />

      <ol className="border-b border-line">
        {roles.map((r) => (
          <li key={r.id} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8" data-reveal>
            <div className="md:col-span-3">
              <p className="font-mono text-sm">{r.period}</p>
              {r.current && (
                <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[0.7rem] text-accent">
                  <span className="pulse h-1.5! w-1.5!" aria-hidden="true" />
                  Current
                </p>
              )}
            </div>

            <div className="md:col-span-6">
              <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{r.company}</h3>
              <p className="mt-1 font-medium">
                {r.title}
                {r.client && <span className="font-normal text-muted"> · {r.client}</span>}
              </p>
              <p className="mt-4 leading-relaxed">{r.summary}</p>
              <ul className="mt-4 space-y-2 text-[0.95rem] text-muted">
                {r.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex flex-wrap content-start gap-2 md:col-span-3 md:justify-end" aria-label="Tech used">
              {r.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3" data-reveal>
          <p className="eyebrow">Earlier</p>
        </div>
        <ul className="space-y-3 md:col-span-6" data-reveal style={delay(80)}>
          {earlier.map((e) => (
            <li key={e.company} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span>
                <span className="font-medium">{e.company}</span>
                <span className="text-muted"> · {e.title}</span>
              </span>
              <span className="font-mono text-sm text-muted">{e.period}</span>
            </li>
          ))}
        </ul>
        <div className="md:col-span-3 md:text-right" data-reveal style={delay(160)}>
          <p className="eyebrow">Education</p>
          <p className="mt-2 font-medium">BS Information Technology</p>
          <p className="text-sm text-muted">University of Caloocan City · 2019</p>
        </div>
      </div>
    </section>
  );
}
