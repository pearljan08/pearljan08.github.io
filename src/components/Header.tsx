import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from './Icons';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex items-baseline gap-0.5 font-serif text-2xl italic" aria-label="Back to top">
          pj
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
        </a>

        <div className="flex items-center gap-1 sm:gap-6">
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center gap-6 font-mono text-[0.8rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link text-muted hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link text-muted hover:text-ink">
                  Resume
                </a>
              </li>
            </ul>
          </nav>

          <a
            href="#contact"
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.75rem] transition-colors hover:border-accent hover:text-accent sm:hidden"
          >
            Contact
          </a>

          <button
            type="button"
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}
