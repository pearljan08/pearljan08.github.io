import portrait from '../assets/portrait.jpg';
import { profile, roles } from '../data/profile';
import { delay } from '../lib/delay';
import { ArrowDown, ArrowRight } from './Icons';

const words = profile.name.split(' ');
const first = words.slice(0, -1).join(' ');
const last = words[words.length - 1];
const current = roles.find((r) => r.current)!;

const facts = [
  { label: 'Experience', value: `${profile.yearsLabel} years` },
  { label: 'Domains', value: 'Banking · SaaS · Education · Government' },
  { label: 'Writing daily', value: current.stack.slice(0, 3).join(' · ') },
];

export default function Hero() {
  return (
    <section id="top" className="shell pt-24 pb-20 sm:pt-32 lg:pb-28">
      <div className="eyebrow flex items-center justify-between gap-4 border-b border-line pb-4">
        <span>{profile.role}</span>
        <span className="hidden sm:inline">Based in the {profile.location}</span>
        <span>Since {profile.since}</span>
      </div>

      <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <h1 className="font-serif text-[clamp(3.75rem,13vw,10.5rem)] leading-[0.86] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise inline-block" style={delay(60)}>
                {first}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <em className="rise inline-block text-accent" style={delay(180)}>
                {last}
              </em>
            </span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lg leading-relaxed sm:text-xl" style={delay(380)}>
            {profile.intro}
          </p>

          <div
            className="rise mt-8 flex max-w-xl items-start gap-3 rounded-lg border border-line bg-surface/60 p-4"
            style={delay(480)}
          >
            <span className="pulse mt-2 shrink-0" aria-hidden="true" />
            <p className="text-[0.95rem] leading-relaxed">
              <span className="eyebrow mr-2">Now</span>
              {profile.now}
            </p>
          </div>

          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={delay(580)}>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
            >
              See selected work
              <ArrowDown className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:border-ink"
            >
              Email me
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <figure className="rise lg:col-span-4 lg:pt-4" style={delay(260)}>
          <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-lg bg-surface lg:max-w-none">
            <img
              src={portrait}
              alt="Pearl Jan Sabanal leaning on a railing at Victoria Harbour, Hong Kong"
              width={900}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover grayscale-[15%] transition-[filter,transform] duration-700 hover:scale-[1.02] hover:grayscale-0"
            />
          </div>
          <figcaption className="eyebrow mx-auto mt-3 flex max-w-sm justify-between lg:max-w-none">
            <span>Fig. 01</span>
            <span>Victoria Harbour, HK</span>
          </figcaption>
        </figure>
      </div>

      <dl className="mt-16 grid gap-6 border-t border-line pt-6 sm:grid-cols-3 lg:mt-24">
        {facts.map((f, i) => (
          <div key={f.label} data-reveal style={delay(i * 90)}>
            <dt className="eyebrow">{f.label}</dt>
            <dd className="mt-2 text-[0.95rem]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
