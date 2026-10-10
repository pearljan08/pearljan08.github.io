import { profile } from '../data/profile';
import { delay } from '../lib/delay';
import SectionHead from './SectionHead';

export default function About() {
  return (
    <section id="about" className="shell py-20 sm:py-28">
      <SectionHead
        index="01"
        label="About"
        title={
          <>
            Software that <em className="text-accent">adds up.</em>
          </>
        }
      />

      <div className="grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3" data-reveal>
          Fullstack, with a soft spot for back-office systems
        </p>
        <div className="space-y-6 text-lg leading-relaxed md:col-span-9 lg:col-span-7">
          {profile.about.map((para, i) => (
            <p key={i} data-reveal style={delay(i * 100)}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
