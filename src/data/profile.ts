import type { EarlierRole, Link, Project, Role, StackGroup } from './types';

import aims1 from '../assets/aims1.jpg';
import losLight from '../assets/los-demo-light.jpg';
import losDark from '../assets/los-demo-dark.jpg';
import hris1 from '../assets/gcg1.png';
import hris2 from '../assets/gcg2.jpg';
import hris3 from '../assets/gcg3.png';

export const profile = {
  name: 'Pearl Jan Sabanal',
  role: 'Fullstack Developer',
  location: 'Philippines',
  email: 'pearljan08@gmail.com',
  yearsLabel: '5+',
  since: 2019,
  intro:
    'I build the systems behind loan approvals, SaaS consoles and everyday business tools: database schema, API and interface.',
  now: 'Building loan origination features for a bank’s salary loans program at Questronix.',
  about: [
    'I’ve spent most of my career on software where correctness matters more than flash. That means loan computations that have to add up, approval flows with a maker and a checker, and HR and academic records that people rely on every day.',
    'I work across the whole stack. On the server it’s PHP and CodeIgniter or Node.js, with MySQL, MariaDB or PostgreSQL underneath. On the client it’s plain modern JavaScript or React with TypeScript. I care about code the next developer can read, pages that load fast, and deployments that don’t surprise anyone.',
  ],
};

export const roles: Role[] = [
  {
    id: 'questronix-now',
    company: 'Questronix Corporation',
    title: 'Fullstack Developer',
    period: 'Apr 2026 — Present',
    current: true,
    client: 'Banking client · Salary loans',
    summary:
      'Outsourced to a bank’s salary loans program, building features for its loan origination system.',
    highlights: [
      'Ship features end to end in the loan origination system, from the database tables to the screens loan officers work in.',
      'Write PHP 8 business logic on CodeIgniter 3 for loan applications, validations and computations.',
      'Build front-end behavior in ES6 JavaScript: dynamic forms, client-side validation, and screens that load data asynchronously.',
      'Design and tune MySQL / MariaDB queries behind the loan pipeline.',
    ],
    stack: ['CodeIgniter 3', 'PHP 8', 'JavaScript (ES6+)', 'MySQL', 'MariaDB'],
  },
  {
    id: 'cognitive',
    company: 'Cognitive AI',
    title: 'Freelance Software Developer',
    period: 'Apr 2025 — Present',
    current: true,
    summary: 'Building web applications in React and TypeScript on a Node.js and PostgreSQL backend.',
    highlights: [
      'Build reusable, scalable UI components and keep state management and API layers clean.',
      'Improve performance with memoization, lazy loading and careful rendering.',
      'Refactor legacy components into a modular frontend architecture.',
      'Work with backend engineers on data flow, and take part in feature planning and UI/UX decisions.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'ascendion',
    company: 'Ascendion',
    title: 'Engineer',
    period: 'Aug 2024 — Mar 2025',
    client: 'Banking client · formerly Collabera Digital',
    summary: 'Managed development and staging environments for SaaS security applications.',
    highlights: [
      'Led deployments from development to staging, including backups and environment alignment.',
      'Coordinated release cycles with platform owners and development teams.',
      'Ran change management to keep releases stable and compliant.',
      'Made deployments more reliable and reduced inconsistencies between environments.',
    ],
    stack: ['Node.js', 'React', 'JavaScript', 'SaaS', 'Cybersecurity'],
  },
  {
    id: 'questronix',
    company: 'Questronix Corporation',
    title: 'Fullstack Developer II',
    period: 'Jan 2022 — Aug 2024',
    client: 'Banking client',
    summary: 'Designed and built fullstack web applications on CodeIgniter and MySQL, including a bank’s loan origination system.',
    highlights: [
      'Built REST APIs and integrated third-party services.',
      'Improved application performance and database efficiency.',
      'Worked with product managers to turn requirements into technical solutions.',
      'Led debugging and software upgrades across multiple modules.',
    ],
    stack: ['PHP', 'CodeIgniter', 'JavaScript', 'MySQL', 'Bootstrap'],
  },
  {
    id: 'pinnacle',
    company: 'Pinnacle Technologies',
    title: 'Web Developer',
    period: 'Sep 2019 — Aug 2020',
    summary: 'Developed and tested modules for AIMS, an academic information system used by schools.',
    highlights: [
      'Built and tested web modules in PHP and CodeIgniter.',
      'Built responsive interfaces in HTML, CSS and JavaScript.',
      'Connected backend services and databases to the front end.',
    ],
    stack: ['PHP', 'CodeIgniter', 'HTML', 'CSS', 'JavaScript'],
  },
];

export const earlier: EarlierRole[] = [
  { company: 'Autumn', title: 'Project-based Web Developer (HRIS for GCG)', period: '2020' },
  { company: 'BIGO Live', title: 'Content Moderator', period: '2020 — 2021' },
  { company: 'Lighthouse Enterprise', title: 'Graphic Designer', period: '2019' },
];

export const projects: Project[] = [
  {
    id: 'los',
    name: 'LOS',
    fullName: 'Loan Origination System',
    context: 'Banking client · Questronix',
    year: '2022 — 2024, 2026 —',
    description:
      'Loan origination for a bank’s salary loan business. Loan officers take in applications, look up a borrower’s existing loans, and compute new loans and re-loans down to fees, rebates and take-home pay. Every application then moves through a maker/checker approval flow.',
    note: 'The real system is under NDA, so I rebuilt its core as a fictional, interactive demo in plain TypeScript. Try submitting as a maker and approving as a checker.',
    features: ['Re-loan computations', 'Rule of 78 rebates', 'Take-home pay checks', 'Maker / checker flow'],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'JavaScript', 'Bootstrap'],
    shots: [
      { src: losLight, caption: 'Demo: re-loan computation with payoff and rebate', width: 1440, height: 1000 },
      { src: losDark, caption: 'Demo: dark mode', width: 1440, height: 1000 },
    ],
    demo: { href: '/demo/los/', label: 'Try the live demo' },
  },
  {
    id: 'hris',
    name: 'HRIS',
    fullName: 'Human Resource Information System',
    context: 'GCG · Autumn (project-based)',
    year: '2020',
    description:
      'An ERP-style HR suite for a government commission. It covers employee records, leave and overtime, payroll setup, and property requisitions, plus a task calendar and company bulletin board on a role-based dashboard.',
    features: ['Employee records', 'Leave & overtime', 'Payroll setup', 'Property requisitions'],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'JavaScript', 'Bootstrap'],
    shots: [
      { src: hris1, caption: 'Admin dashboard and task calendar', width: 1236, height: 446 },
      { src: hris2, caption: 'Payroll type maintenance', width: 1600, height: 900 },
      { src: hris3, caption: 'Requisition and issue slip', width: 931, height: 560 },
    ],
  },
  {
    id: 'aims',
    name: 'AIMS',
    fullName: 'Academic Information Management System',
    context: 'Pinnacle Technologies',
    year: '2019 — 2020',
    description:
      'An academic platform with separate portals for students, faculty and administrators. Students register for subjects, view assessments and statements of account, and manage their profiles. It is deployed at schools including La Consolacion College Caloocan.',
    features: ['Student access module', 'Subject registration', 'Assessments & SOA', 'Faculty & admin portals'],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'JavaScript', 'Bootstrap'],
    shots: [
      { src: aims1, caption: 'Student access module, La Consolacion College Caloocan', width: 1600, height: 501 },
    ],
  },
];

export const stack: StackGroup[] = [
  { label: 'Day to day', items: ['PHP 8', 'CodeIgniter 3', 'JavaScript (ES6+)', 'MySQL', 'MariaDB'] },
  { label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Vue', 'Tailwind CSS', 'Bootstrap'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'PHP', 'CodeIgniter'] },
  { label: 'Data', items: ['PostgreSQL', 'MySQL', 'MariaDB'] },
  {
    label: 'Practice',
    items: ['REST APIs', 'SaaS architecture', 'Deployments & staging', 'Environment alignment', 'Performance tuning'],
  },
];

export const links: Link[] = [
  { label: 'Email', href: `mailto:${profile.email}`, display: profile.email },
  { label: 'GitHub', href: 'https://github.com/pearljan08', display: 'github.com/pearljan08' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pearl-jan-sabanal-0b3402187/',
    display: 'linkedin.com/in/pearl-jan-sabanal',
  },
];
