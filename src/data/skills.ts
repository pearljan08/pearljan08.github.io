import type { SkillCategory } from './types';

export const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React JS' },
      { name: 'Vue JS' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Tailwind CSS' },
      { name: 'Bootstrap' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node JS' },
      { name: 'Nest JS' },
      { name: 'PHP' },
      { name: 'CodeIgniter' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'MySQL' },
      { name: 'PostgreSQL' },
    ],
  },
];
