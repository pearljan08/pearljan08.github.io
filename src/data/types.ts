export interface Experience {
  id: string;
  title: string;
  client?: string;
  company: string;
  date: string;
  description: string[];
  logo: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techUsed: string[];
  image: string[];
}

export interface Skill {
  name: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'email';
}
