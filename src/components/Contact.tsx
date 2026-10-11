import { useState } from 'react';
import { links, profile } from '../data/profile';
import { delay } from '../lib/delay';
import { ArrowUpRight, Check, Copy } from './Icons';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="shell py-20 sm:py-28">
      <div className="flex items-baseline gap-4 border-t border-line pt-5" data-reveal>
        <span className="eyebrow text-accent!">05</span>
        <span className="eyebrow">Contact</span>
      </div>

      <h2
        className="mt-10 max-w-5xl font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-tight"
        data-reveal
        style={delay(80)}
      >
        Have a system that needs <em className="text-accent">building?</em>
      </h2>

      <p className="mt-8 max-w-xl text-lg text-muted" data-reveal style={delay(160)}>
        I’m open to freelance work and interesting conversations. The fastest way to reach me is email.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3" data-reveal style={delay(240)}>
        <a
          href={`mailto:${profile.email}`}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-bg transition-colors hover:bg-accent"
        >
          {profile.email}
          <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3.5 text-sm transition-colors hover:border-ink"
          aria-live="polite"
        >
          {copied ? <Check className="text-accent" /> : <Copy />}
          {copied ? 'Copied' : 'Copy email'}
        </button>
      </div>

      <ul className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" data-reveal>
        {links.map((l) => (
          <li key={l.label} className="bg-bg">
            <a
              href={l.href}
              {...(l.href.startsWith('http') || l.href.endsWith('.pdf') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-surface sm:p-6"
            >
              <span>
                <span className="eyebrow block">{l.label}</span>
                <span className="mt-1 block break-all">{l.display}</span>
              </span>
              <ArrowUpRight className="shrink-0 text-xl text-muted transition-colors group-hover:text-accent" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
