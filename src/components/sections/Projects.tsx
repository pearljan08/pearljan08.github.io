import { useState } from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { projects } from '../../data/projects';
import type { Project } from '../../data/types';

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        title="Projects"
        subtitle="Some of the projects I've worked on."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => setActiveProject(project)}
          />
        ))}
      </div>
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </SectionWrapper>
  );
}
