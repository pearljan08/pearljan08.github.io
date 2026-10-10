import { useEffect, useRef } from 'react';
import type { Project } from '../data/types';
import { ChevronLeft, ChevronRight, Close } from './Icons';

interface Props {
  project: Project | null;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}

/** Screenshot viewer built on the native <dialog>: focus trap, Esc and backdrop handling come for free. */
export default function Gallery({ project, index, onIndex, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const count = project?.shots.length ?? 0;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!project) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    if (!project || count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % count);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, index, count, onIndex]);

  const shot = project?.shots[index];

  return (
    <dialog
      ref={ref}
      className="gallery"
      aria-label={project ? `${project.fullName} screenshots` : undefined}
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the backdrop land on the <dialog> element itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {project && shot && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="eyebrow">
                {project.name} · {index + 1} / {count}
              </p>
              <p className="truncate text-sm">{shot.caption}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-surface hover:text-ink"
              aria-label="Close"
              autoFocus
            >
              <Close />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 bg-surface">
            <img
              key={shot.src}
              src={shot.src}
              alt={`${project.fullName}: ${shot.caption}`}
              width={shot.width}
              height={shot.height}
              className="mx-auto block h-auto max-h-[75dvh] w-auto max-w-full object-contain"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onIndex((index - 1 + count) % count)}
                  className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-xl shadow-md transition-colors hover:text-accent"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => onIndex((index + 1) % count)}
                  className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-xl shadow-md transition-colors hover:text-accent"
                  aria-label="Next screenshot"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="flex gap-2 overflow-x-auto border-t border-line p-3">
              {project.shots.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`Show screenshot ${i + 1}: ${s.caption}`}
                  aria-current={i === index}
                  className={`h-14 w-24 shrink-0 overflow-hidden rounded border-2 bg-white transition-colors ${
                    i === index ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
