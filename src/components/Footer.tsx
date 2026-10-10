import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="shell pb-10">
      <div className="eyebrow flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Designed &amp; built from scratch · React, TypeScript, Tailwind</span>
        <a href="#top" className="link self-start sm:self-auto">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
