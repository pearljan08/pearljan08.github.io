import { useEffect } from 'react';

/** Adds `.is-in` to every `[data-reveal]` element the first time it scrolls into view. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      // A small fixed margin, so content at the very bottom of the page can still reveal
      { rootMargin: '0px 0px -24px 0px', threshold: 0 },
    );

    els.forEach((el) => io.observe(el));

    // Printing never scrolls, so show everything
    const showAll = () => els.forEach((el) => el.classList.add('is-in'));
    window.addEventListener('beforeprint', showAll);

    return () => {
      io.disconnect();
      window.removeEventListener('beforeprint', showAll);
    };
  }, []);
}
