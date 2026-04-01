import { useEffect, useRef } from 'react';

interface SlotCounterProps {
  value: number;
  suffix?: string;
  duration?: number;  // ms
  delay?: number;     // ms
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3); // cubic ease-out
}

export default function SlotCounter({
  value,
  suffix = '',
  duration = 1400,
  delay = 0,
}: SlotCounterProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;

    let rafId: number;
    let started = false;

    const runAnimation = () => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        numEl.textContent = String(Math.floor(easeOut(progress) * value));
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          numEl.textContent = String(value);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          observer.disconnect();
          if (delay > 0) {
            setTimeout(runAnimation, delay);
          } else {
            runAnimation();
          }
        }
      },
      { rootMargin: '-30px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [value, duration, delay]);

  return (
    <span ref={wrapRef} className="inline-block tabular-nums text-accent">
      <span ref={numRef}>0</span>{suffix}
    </span>
  );
}
