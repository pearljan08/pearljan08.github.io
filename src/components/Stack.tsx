import { stack } from '../data/profile';
import { delay } from '../lib/delay';
import SectionHead from './SectionHead';

export default function Stack() {
  return (
    <section id="stack" className="shell py-20 sm:py-28">
      <SectionHead
        index="04"
        label="Stack"
        title={
          <>
            Tools I <em className="text-accent">reach for</em>
          </>
        }
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((g, i) => (
          <div
            key={g.label}
            className={`bg-bg p-6 sm:p-8 ${i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
            data-reveal
            style={delay(i * 70)}
          >
            <p className={`eyebrow ${i === 0 ? 'text-accent!' : ''}`}>{g.label}</p>
            <ul className={`mt-5 ${i === 0 ? 'space-y-1' : 'flex flex-wrap gap-x-4 gap-y-1'}`}>
              {g.items.map((item) => (
                <li key={item} className={i === 0 ? 'font-serif text-4xl leading-tight sm:text-5xl' : 'text-lg'}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
