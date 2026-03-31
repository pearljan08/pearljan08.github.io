import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Experience } from '../../data/types';

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  isLast: boolean;
}

export default function ExperienceItem({ experience, index, isLast }: ExperienceItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative pl-8 md:pl-10"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[15px] top-6 bottom-0 w-px bg-gray-700" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1 top-1.5 w-6 h-6 rounded-full border-2 border-accent bg-dark-900 z-10" />

      {/* Content */}
      <div
        className="pb-8 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
              {experience.title}
              {experience.client && (
                <span className="text-gray-400 font-normal"> ({experience.client})</span>
              )}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <img
                src={experience.logo}
                alt={experience.company}
                className="w-5 h-5 rounded object-cover"
              />
              <p className="text-accent-light font-medium text-sm">{experience.company}</p>
            </div>
            <p className="text-gray-500 text-sm mt-1">{experience.date}</p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mt-3 space-y-1.5"
            >
              {experience.description.map((desc, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="text-accent mt-1 shrink-0">-</span>
                  {desc}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
