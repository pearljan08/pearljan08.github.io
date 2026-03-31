import { motion } from 'motion/react';
import type { Project } from '../../data/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-800/50 border border-gray-700/50
                 hover:border-accent/30 transition-colors duration-300"
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={project.image[0]}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/60 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techUsed.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/30"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{project.description}</p>
      </div>
    </motion.div>
  );
}
