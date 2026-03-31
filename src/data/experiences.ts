import type { Experience } from './types';
import qnxLogo from '../assets/qnx.png';
import ascendionLogo from '../assets/ascendion.jpg';
import pinnacleLogo from '../assets/pinnacle.png';

export const experiences: Experience[] = [
  {
    id: 'ascendion',
    title: 'Engineer',
    client: 'Security Bank',
    company: 'Ascendion (Formerly Collabera Digital)',
    date: 'August 2024 - March 2025',
    description: [
      'Work with development teams and platform owners',
      'Responsible for managing the development and staging environments of the SaaS platform',
      'Oversee development efforts',
      'Perform deployment procedures from dev to staging environments including backup, environment alignment, and other necessary steps',
      'Manage change process activities',
    ],
    logo: qnxLogo,
  },
  {
    id: 'questronix',
    title: 'Full Stack Developer II',
    client: 'CitySavings Bank',
    company: 'Questronix Corporations',
    date: 'January 2022 - August 2024',
    description: [
      'Work with development teams and product managers to ideate software solutions',
      'Design client-side and server-side architecture using CodeIgniter (PHP)',
      'Build the front-end of applications through appealing visual design with Javascript/Bootstrap',
      'Develop and manage well-functioning databases with MySQL',
      'Write effective APIs using RESTful API',
      'Test software to ensure responsiveness and efficiency',
      'Troubleshoot, debug and upgrade software',
    ],
    logo: ascendionLogo,
  },
  {
    id: 'autumn',
    title: 'Web Developer',
    client: 'GCG - Project Based',
    company: 'Autumn',
    date: 'November 2020 - December 2020',
    description: [
      'Create modules required for completion of the project',
      'Used CodeIgniter',
    ],
    logo: pinnacleLogo,
  },
  {
    id: 'pinnacle',
    title: 'Web Developer',
    company: 'Pinnacle Technologies',
    date: 'September 2019 - August 2020',
    description: [
      'Create and test apps/modules for the website',
      'Quality-test and troubleshoot the website and/or its applications in various browsers',
      'Create websites and user interfaces, using standard HTML/CSS practices, while incorporating data from back-end databases and services',
    ],
    logo: pinnacleLogo,
  },
  {
    id: 'lighthouse',
    title: 'Graphic Designer',
    company: 'Lighthouse Enterprise',
    date: 'May 2019 - September 2019',
    description: [
      'Design and create graphics for their eCommerce platform',
      'Design and create graphics for their social media accounts',
    ],
    logo: pinnacleLogo,
  },
];
