import './style.css';
import { $, TODAY, addDays, checks, clearSaved, esc, field, fmtDate, fmtDateTime, kpi, loadSaved, money, peso, plural, round2, save, select, sum, toast } from '../shared/util';

/* ============================================================
 * Types
 * ============================================================ */

type Role = 'student' | 'faculty' | 'registrar';
type View = 'registration' | 'account' | 'grades' | 'classes' | 'enlistments' | 'accounts' | 'sections';
type Day = 'M' | 'T' | 'W' | 'Th' | 'F' | 'S';
type EnlistStatus = 'draft' | 'pending' | 'returned' | 'enrolled';
type Plan = 'full' | 'installment';

interface Subject {
  code: string;
  title: string;
  units: number;
  lab?: boolean;
  prereq?: string;
}

interface Section {
  id: string;
  code: string;
  days: Day[];
  start: number; // minutes after midnight
  end: number;
  room: string;
  faculty: string;
  slots: number;
}

interface PastTerm {
  term: string;
  grades: [code: string, title: string, units: number, grade: number][];
}

interface Student {
  id: string;
  name: string;
  program: string;
  year: string;
  history: PastTerm[];
}

interface Entry {
  at: string;
  by: string;
  action: string;
  remarks?: string;
}

interface Enlistment {
  studentId: string;
  sections: string[];
  plan: Plan;
  status: EnlistStatus;
  enrolledAt?: string;
  history: Entry[];
}

interface Payment {
  or: string;
  studentId: string;
  amount: number;
  at: string;
  by: string;
}

interface Grade {
  prelim: number | null;
  midterm: number | null;
}

interface Data {
  students: Student[];
  enlistments: Enlistment[];
  payments: Payment[];
  /** Names of students already in each section (before this demo's enlistments) */
  rosters: Record<string, { id: string; name: string }[]>;
  /** grades[sectionId][studentId] */
  grades: Record<string, Record<string, Grade>>;
  /** Sections whose midterm grades have been submitted */
  submitted: string[];
}

/* ============================================================
 * Catalog and rules (fictional, for the demo)
 * ============================================================ */

const TERM = 'AY 2026–2027 · 1st Semester';
const SCHOOL = 'Northfield College (demo)';

const RULES = {
  maxUnits: 21,
  tuitionPerUnit: 1_450,
  labFee: 2_200,
  misc: [
    ['Registration', 1_200],
    ['Library', 950],
    ['IT and internet', 1_800],
    ['Medical and dental', 600],
    ['Athletics', 500],
    ['ID validation', 250],
  ] as [string, number][],
  fullPaymentDiscount: 0.05,
  installmentFee: 500,
  downPayment: 0.3,
  passing: 3.0,
};

const SUBJECTS: Subject[] = [
  { code: 'IT 203', title: 'Networking 1', units: 3, lab: true, prereq: 'IT 102' },
  { code: 'IT 301', title: 'Web Development', units: 3, lab: true, prereq: 'IT 103' },
  { code: 'IT 302', title: 'Database Systems 2', units: 3, lab: true, prereq: 'IT 202' },
  { code: 'IT 303', title: 'Networking 2', units: 3, lab: true, prereq: 'IT 203' },
  { code: 'IT 304', title: 'Software Engineering 1', units: 3, prereq: 'IT 201' },
  { code: 'IT 305', title: 'Information Assurance and Security', units: 3, lab: true },
  { code: 'GE 105', title: 'Ethics', units: 3 },
  { code: 'GE 106', title: 'Art Appreciation', units: 3 },
  { code: 'PE 3', title: 'Individual and Dual Sports', units: 2 },
];

const h = (hh: number, mm = 0) => hh * 60 + mm;
const SECTIONS: Section[] = [
  { id: 'IT203-A', code: 'IT 203', days: ['T', 'Th'], start: h(15), end: h(16, 30), room: 'CL-1', faculty: 'Engr. Paolo Lim', slots: 30 },
  { id: 'IT301-A', code: 'IT 301', days: ['M', 'W'], start: h(8), end: h(9, 30), room: 'CL-2', faculty: 'Prof. Ramon Aquino', slots: 30 },
  { id: 'IT301-B', code: 'IT 301', days: ['T', 'Th'], start: h(13), end: h(14, 30), room: 'CL-2', faculty: 'Prof. Ramon Aquino', slots: 30 },
  { id: 'IT302-A', code: 'IT 302', days: ['M', 'W'], start: h(10), end: h(11, 30), room: 'CL-3', faculty: 'Prof. Teresa Uy', slots: 35 },
  { id: 'IT303-A', code: 'IT 303', days: ['T', 'Th'], start: h(8), end: h(9, 30), room: 'CL-1', faculty: 'Engr. Paolo Lim', slots: 30 },
  { id: 'IT304-A', code: 'IT 304', days: ['T', 'Th'], start: h(10), end: h(11, 30), room: 'R-304', faculty: 'Prof. Jun Navarro', slots: 35 },
  { id: 'IT304-B', code: 'IT 304', days: ['M', 'W'], start: h(9), end: h(10, 30), room: 'R-304', faculty: 'Prof. Jun Navarro', slots: 35 },
  { id: 'IT305-A', code: 'IT 305', days: ['F'], start: h(8), end: h(11), room: 'CL-1', faculty: 'Prof. Ramon Aquino', slots: 30 },
  { id: 'GE105-A', code: 'GE 105', days: ['T', 'Th'], start: h(14, 30), end: h(16), room: 'R-210', faculty: 'Dr. Celia Ramos', slots: 45 },
  { id: 'GE105-B', code: 'GE 105', days: ['M', 'W'], start: h(13), end: h(14, 30), room: 'R-210', faculty: 'Dr. Celia Ramos', slots: 45 },
  { id: 'GE106-A', code: 'GE 106', days: ['S'], start: h(8), end: h(11), room: 'R-210', faculty: 'Prof. Mia Herrera', slots: 45 },
  { id: 'PE3-A', code: 'PE 3', days: ['S'], start: h(13), end: h(15), room: 'Gym', faculty: 'Coach Ben Torres', slots: 40 },
];

/** How many students each section already had, before anyone in this demo enlists */
const BASE_COUNT: Record<string, number> = {
  'IT203-A': 14, 'IT301-A': 24, 'IT301-B': 29, 'IT302-A': 22, 'IT303-A': 12, 'IT304-A': 25,
  'IT304-B': 18, 'IT305-A': 20, 'GE105-A': 40, 'GE105-B': 44, 'GE106-A': 31, 'PE3-A': 39,
};

const DAYS: Day[] = ['M', 'T', 'W', 'Th', 'F', 'S'];
const DAY_NAME: Record<Day, string> = { M: 'Mon', T: 'Tue', W: 'Wed', Th: 'Thu', F: 'Fri', S: 'Sat' };

const ME = {
  student: '2024-01187',
  faculty: 'Prof. Ramon Aquino',
  registrar: 'L. Navarro',
};

const STATUS: Record<EnlistStatus, [string, string]> = {
  draft: ['Not submitted', 'neutral'],
  pending: ['For validation', 'info'],
  returned: ['Returned', 'bad'],
  enrolled: ['Officially enrolled', 'good'],
};

/* ============================================================
 * Helpers
 * ============================================================ */

const subject = (code: string) => SUBJECTS.find((s) => s.code === code)!;
const section = (id: string) => SECTIONS.find((s) => s.id === id)!;
const unitsOf = (ids: string[]) => sum(ids.map((id) => subject(section(id).code).units));

function fmtTime(m: number) {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')}${hh < 12 ? ' AM' : ' PM'}`;
}
const sched = (s: Section) => `${s.days.join('')} ${fmtTime(s.start).replace(' AM', '').replace(' PM', '')}–${fmtTime(s.end)}`;
const overlaps = (a: Section, b: Section) => a.days.some((d) => b.days.includes(d)) && a.start < b.end && b.start < a.end;

/** 1.00 (highest) to 5.00 (failed), from a 0–100 score */
function transmute(score: number) {
  const table: [number, number][] = [[97, 1.0], [94, 1.25], [91, 1.5], [88, 1.75], [85, 2.0], [82, 2.25], [79, 2.5], [76, 2.75], [75, 3.0]];
  return table.find(([min]) => score >= min)?.[1] ?? 5.0;
}
const midtermScore = (g: Grade) => (g.prelim == null || g.midterm == null ? null : Math.round(g.prelim * 0.4 + g.midterm * 0.6));
const fmtGrade = (g: number) => g.toFixed(2);

/** Deterministic pseudo-random numbers, so the seeded grade sheets look the same every visit */
function rng(seedText: string) {
  let x = [...seedText].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 2 ** 32;
  };
}

/* ============================================================
 * Seed data (all fictional)
 * ============================================================ */

const FIRST = ['Aira', 'Ben', 'Carla', 'Dino', 'Ella', 'Franco', 'Gia', 'Hans', 'Ines', 'Jao', 'Kim', 'Lara', 'Migs', 'Nina', 'Oscar', 'Pia', 'Quin', 'Rafa', 'Sam', 'Tina', 'Ugo', 'Vina', 'Wes', 'Xyra', 'Yeng', 'Zed'];
const LAST = ['Abad', 'Bello', 'Castro', 'Diaz', 'Estrada', 'Flores', 'Garcia', 'Hizon', 'Ignacio', 'Javier', 'Katigbak', 'Lopez', 'Magno', 'Nieva', 'Ocampo', 'Pascual', 'Quiambao', 'Rivera', 'Salazar', 'Tolentino'];

function seed(): Data {
  const t = (n: number, time = '09:00') => `${addDays(TODAY, n)}T${time}:00`;

  const history = (fail: boolean): PastTerm[] => [
    { term: 'AY 2024–2025 · 1st Semester', grades: [['IT 101', 'Introduction to Computing', 3, 1.5], ['IT 102', 'Computer Programming 1', 3, 1.75], ['MATH 101', 'College Algebra', 3, 1.75], ['GE 101', 'Purposive Communication', 3, 1.25], ['PE 1', 'Physical Fitness', 2, 1.0]] },
    { term: 'AY 2024–2025 · 2nd Semester', grades: [['IT 103', 'Computer Programming 2', 3, 2.0], ['IT 104', 'Digital Logic', 3, 2.25], ['MATH 102', 'Discrete Mathematics', 3, 2.5], ['GE 102', 'Readings in Philippine History', 3, 1.75], ['PE 2', 'Rhythmic Activities', 2, 1.25]] },
    { term: 'AY 2025–2026 · 1st Semester', grades: [['IT 201', 'Data Structures and Algorithms', 3, 1.75], ['IT 202', 'Database Systems 1', 3, 2.25], ['IT 203', 'Networking 1', 3, fail ? 5.0 : 2.0], ['GE 103', 'Science, Technology and Society', 3, 1.5], ['GE 104', 'Mathematics in the Modern World', 3, 2.0]] },
    { term: 'AY 2025–2026 · 2nd Semester', grades: [['IT 204', 'Object-Oriented Programming', 3, 1.5], ['IT 205', 'Systems Analysis and Design', 3, 1.75], ['IT 206', 'Human–Computer Interaction', 3, 1.25], ['GE 107', 'The Contemporary World', 3, 1.75]] },
  ];

  const students: Student[] = [
    { id: '2024-01187', name: 'Bea Dizon', program: 'BS Information Technology', year: '3rd year', history: history(true) },
    { id: '2024-01022', name: 'Carl Ong', program: 'BS Information Technology', year: '3rd year', history: history(false) },
    { id: '2024-01310', name: 'Dana Ilagan', program: 'BS Information Technology', year: '3rd year', history: history(true) },
    { id: '2024-01045', name: 'Enzo Robles', program: 'BS Information Technology', year: '3rd year', history: history(false) },
  ];

  // Fill each section with made-up classmates
  const rosters: Data['rosters'] = {};
  let n = 0;
  for (const s of SECTIONS) {
    rosters[s.id] = Array.from({ length: BASE_COUNT[s.id] }, () => {
      const i = n++;
      return { id: `2024-0${2000 + ((i * 37) % 1000)}`, name: `${LAST[(i * 7) % LAST.length]}, ${FIRST[(i * 11) % FIRST.length]}` };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  // Prelim grades are in for Prof. Aquino's classes; midterms are mostly done
  const grades: Data['grades'] = {};
  for (const id of ['IT301-A', 'IT301-B', 'IT305-A']) {
    const r = rng(id);
    grades[id] = {};
    rosters[id].forEach((st, i) => {
      const prelim = Math.round(70 + r() * 28);
      const missing = id === 'IT301-A' ? i >= rosters[id].length - 4 : i % 9 === 4;
      grades[id][st.id] = { prelim, midterm: missing ? null : Math.min(99, Math.max(60, Math.round(prelim + (r() - 0.45) * 16))) };
    });
  }

  return {
    students,
    enlistments: [
      { studentId: '2024-01187', sections: ['IT302-A', 'GE105-A'], plan: 'installment', status: 'draft', history: [] },
      {
        studentId: '2024-01022', sections: ['IT301-A', 'IT302-A', 'IT304-A', 'GE105-A', 'PE3-A'], plan: 'full', status: 'pending',
        history: [{ at: t(-1, '10:12'), by: 'Carl Ong', action: 'Submitted enlistment' }],
      },
      {
        studentId: '2024-01310', sections: ['IT303-A', 'IT305-A', 'GE106-A', 'IT304-B'], plan: 'installment', status: 'pending',
        history: [{ at: t(-2, '14:40'), by: 'Dana Ilagan', action: 'Submitted enlistment', remarks: 'Encoded at the registrar’s counter' }],
      },
      {
        studentId: '2024-01045', sections: ['IT301-B', 'IT302-A', 'IT304-A', 'GE106-A'], plan: 'installment', status: 'enrolled', enrolledAt: addDays(TODAY, -40),
        history: [
          { at: t(-41, '08:30'), by: 'Enzo Robles', action: 'Submitted enlistment' },
          { at: t(-40, '11:05'), by: ME.registrar, action: 'Validated · officially enrolled' },
        ],
      },
    ],
    payments: [
      { or: 'OR-104871', studentId: '2024-01045', amount: 10_000, at: t(-40, '11:20'), by: 'Cashier' },
      { or: 'OR-105102', studentId: '2024-01045', amount: 5_000, at: t(-12, '15:02'), by: 'Cashier' },
    ],
    rosters,
    grades,
    submitted: ['IT305-A'],
  };
}

/* ============================================================
 * State
 * ============================================================ */

const STORAGE_KEY = 'campus-aims-demo-v1';
const VIEWS: Record<Role, View[]> = {
  student: ['registration', 'account', 'grades'],
  faculty: ['classes'],
  registrar: ['enlistments', 'accounts', 'sections'],
};

interface State {
  data: Data;
  role: Role;
  view: View;
  classId: string;
  accountId: string;
  returning: string | null; // student whose enlistment is being returned
}

const saved = loadSaved<Pick<State, 'data' | 'role'>>(STORAGE_KEY, (v) => !!v.data?.students?.length);
const params = new URLSearchParams(location.search);
const asRole = params.get('as') as Role | null;
const initialRole: Role = asRole && asRole in VIEWS ? asRole : saved?.role ?? 'student';
const hashView = location.hash.slice(1) as View;

const state: State = {
  data: saved?.data ?? seed(),
  role: initialRole,
  view: VIEWS[initialRole].includes(hashView) ? hashView : VIEWS[initialRole][0],
  classId: 'IT301-A',
  accountId: '2024-01045',
  returning: null,
};

const D = () => state.data;
const persist = () => save(STORAGE_KEY, { data: state.data, role: state.role });
const student = (id: string) => D().students.find((s) => s.id === id)!;
const enlistment = (id: string) => D().enlistments.find((e) => e.studentId === id)!;
const myEnlistment = () => enlistment(ME.student);
const actor = () => (state.role === 'student' ? student(ME.student).name : ME[state.role]);
const stamp = (action: string, remarks?: string): Entry => ({ at: new Date().toISOString(), by: actor(), action, remarks });

/** Everyone in a section: the seeded classmates plus officially enrolled demo students */
function roster(sectionId: string) {
  const extra = D()
    .enlistments.filter((e) => e.status === 'enrolled' && e.sections.includes(sectionId))
    .map((e) => ({ id: e.studentId, name: student(e.studentId).name.split(' ').reverse().join(', ') }));
  return [...D().rosters[sectionId], ...extra];
}
const taken = (sectionId: string) => roster(sectionId).length;

/* ============================================================
 * Enlistment rules
 * ============================================================ */

function passed(st: Student, code: string) {
  return st.history.some((t) => t.grades.some(([c, , , g]) => c === code && g <= RULES.passing));
}

/** Why a section can't go into this enlistment, or null if it can */
function blocker(st: Student, chosen: string[], sectionId: string): string | null {
  const s = section(sectionId);
  const subj = subject(s.code);
  const others = chosen.filter((id) => id !== sectionId);
  if (passed(st, subj.code)) return 'Already passed';
  if (subj.prereq && !passed(st, subj.prereq)) return `Needs ${subj.prereq}`;
  if (others.some((id) => section(id).code === s.code)) return 'Subject already added';
  const clash = others.find((id) => overlaps(section(id), s));
  if (clash) return `Conflicts with ${section(clash).code}`;
  if (taken(sectionId) >= s.slots) return 'Section full';
  if (unitsOf(others) + subj.units > RULES.maxUnits) return `Over ${RULES.maxUnits} units`;
  return null;
}

function enlistmentErrors(e: Enlistment) {
  const st = student(e.studentId);
  const errors = e.sections.map((id) => [id, blocker(st, e.sections, id)] as const).filter(([, b]) => b).map(([id, b]) => `${section(id).code} (${id}): ${b}`);
  if (!e.sections.length) errors.push('Add at least one subject.');
  return errors;
}

/* ============================================================
 * Assessment and statement of account
 * ============================================================ */

function assess(sectionIds: string[], plan: Plan) {
  const units = unitsOf(sectionIds);
  const labs = sectionIds.filter((id) => subject(section(id).code).lab).length;
  const tuition = units * RULES.tuitionPerUnit;
  const lab = labs * RULES.labFee;
  const misc = sum(RULES.misc.map(([, v]) => v));
  const discount = plan === 'full' ? round2(tuition * RULES.fullPaymentDiscount) : 0;
  const fee = plan === 'installment' ? RULES.installmentFee : 0;
  const total = round2(tuition + lab + misc - discount + fee);
  return { units, labs, tuition, lab, misc, discount, fee, total };
}

function schedule(e: Enlistment) {
  const { total } = assess(e.sections, e.plan);
  const start = e.enrolledAt ?? TODAY;
  if (e.plan === 'full') return [{ label: 'Upon enrollment', due: start, amount: total }];
  const down = round2(total * RULES.downPayment);
  const each = round2((total - down) / 3);
  return [
    { label: 'Down payment', due: start, amount: down },
    { label: 'Prelim exam', due: addDays(start, 30), amount: each },
    { label: 'Midterm exam', due: addDays(start, 65), amount: each },
    // The last installment absorbs rounding
    { label: 'Final exam', due: addDays(start, 110), amount: round2(total - down - each * 2) },
  ];
}

function soa(studentId: string) {
  const e = enlistment(studentId);
  const paid = round2(sum(D().payments.filter((p) => p.studentId === studentId).map((p) => p.amount)));
  let left = paid;
  const dues = schedule(e).map((d) => {
    const applied = Math.min(left, d.amount);
    left = round2(left - applied);
    const status = applied >= d.amount ? 'Paid' : d.due < TODAY ? 'Overdue' : applied > 0 ? 'Partial' : 'Unpaid';
    return { ...d, applied, status };
  });
  const total = assess(e.sections, e.plan).total;
  const dueNow = round2(sum(dues.filter((d) => d.due <= TODAY).map((d) => d.amount - d.applied)));
  return { dues, paid, total, balance: round2(total - paid), dueNow, next: dues.find((d) => d.status !== 'Paid') };
}

/* ============================================================
 * Rendering helpers
 * ============================================================ */

const last = <T>(xs: T[]): T | undefined => xs[xs.length - 1];
const statusBadge = (s: EnlistStatus) => `<span class="badge badge-${STATUS[s][1]}">${STATUS[s][0]}</span>`;
const dueBadge = (s: string) => `<span class="badge badge-${{ Paid: 'good', Overdue: 'bad', Partial: 'warn', Unpaid: 'neutral' }[s]}">${s}</span>`;

function timetable(ids: string[]) {
  const top = h(7);
  const row = (m: number) => 2 + (m - top) / 30;
  const conflicts = new Set(ids.filter((a) => ids.some((b) => a !== b && overlaps(section(a), section(b)))));
  const lines = Array.from({ length: 11 }, (_, i) => {
    const m = top + i * 60;
    return `<div class="tt-time" style="grid-row:${row(m)} / span 2">${fmtTime(m).replace(':00', '')}</div><div class="tt-line" style="grid-row:${row(m)}"></div>`;
  }).join('');
  const blocks = ids
    .flatMap((id) => {
      const s = section(id);
      return s.days.map(
        (d) => `<div class="tt-block ${conflicts.has(id) ? 'conflict' : ''}" style="grid-column:${DAYS.indexOf(d) + 2};grid-row:${row(s.start)} / ${row(s.end)}" title="${esc(`${s.code} · ${sched(s)} · ${s.room}`)}"><strong>${esc(s.code)}</strong>${s.room}</div>`,
      );
    })
    .join('');
  return `<div class="tt" aria-label="Weekly schedule">${DAYS.map((d, i) => `<div class="tt-dow" style="grid-column:${i + 2}">${DAY_NAME[d]}</div>`).join('')}${lines}${blocks}</div>`;
}

function assessmentList(sectionIds: string[], plan: Plan) {
  const a = assess(sectionIds, plan);
  return `
    <dl class="kv">
      <div><dt>Tuition · ${a.units} units × ${money.format(RULES.tuitionPerUnit)}</dt><dd class="num">${money.format(a.tuition)}</dd></div>
      <div><dt>Laboratory · ${plural(a.labs, 'subject')}</dt><dd class="num">${money.format(a.lab)}</dd></div>
      <div><dt>Miscellaneous</dt><dd class="num">${money.format(a.misc)}</dd></div>
      ${a.discount ? `<div><dt>Less: full payment discount (${RULES.fullPaymentDiscount * 100}% of tuition)</dt><dd class="num">−${money.format(a.discount)}</dd></div>` : ''}
      ${a.fee ? `<div><dt>Installment fee</dt><dd class="num">${money.format(a.fee)}</dd></div>` : ''}
      <div class="total"><dt>Total assessment</dt><dd class="num">${peso(a.total)}</dd></div>
    </dl>`;
}

/* ============================================================
 * Student views
 * ============================================================ */

function renderRegistration() {
  const st = student(ME.student);
  const e = myEnlistment();
  const editable = e.status === 'draft' || e.status === 'returned';
  const errors = enlistmentErrors(e);
  const lastReturn = [...e.history].reverse().find((x) => x.action === 'Returned');

  const rows = SECTIONS.map((s) => {
    const subj = subject(s.code);
    const inList = e.sections.includes(s.id);
    const why = inList ? null : blocker(st, e.sections, s.id);
    const n = taken(s.id);
    const action = !editable
      ? inList ? '<span class="badge badge-info">Enlisted</span>' : ''
      : inList
        ? `<button type="button" class="btn btn-sm" data-action="drop" data-id="${s.id}">Remove</button>`
        : why
          ? `<span class="tag">${esc(why)}</span>`
          : `<button type="button" class="btn btn-sm btn-primary" data-action="add" data-id="${s.id}">Add</button>`;
    return `<tr ${inList ? 'aria-selected="true"' : ''}>
      <td><span class="subj"><strong>${esc(subj.code)}</strong><small>${esc(subj.title)}${subj.prereq ? ` · prereq ${esc(subj.prereq)}` : ''}</small></span></td>
      <td class="mono">${s.id.split('-')[1]}</td>
      <td class="num">${subj.units}</td>
      <td>${sched(s)}<br><span class="muted small">${s.room} · ${esc(s.faculty)}</span></td>
      <td><span class="fill"><span class="small">${n}/${s.slots}</span><span class="fill-bar ${n >= s.slots ? 'full' : ''}"><span style="width:${Math.min(100, (n / s.slots) * 100)}%"></span></span></span></td>
      <td>${action}</td>
    </tr>`;
  }).join('');

  return `
    <div class="view-head">
      <div><h1>Registration</h1><p>${esc(st.name)} · ${st.id} · ${esc(st.program)}, ${st.year}</p></div>
      ${statusBadge(e.status)}
    </div>
    ${e.status === 'returned' && lastReturn?.remarks ? `<div class="callout"><strong>Returned by the registrar:</strong> ${esc(lastReturn.remarks)}</div>` : ''}
    <div class="grid-main">
      <div class="stack">
        <section class="panel">
          <div class="spread"><h3>Offered sections</h3><span class="muted small">Max load ${RULES.maxUnits} units · prerequisites need a passing grade (${fmtGrade(RULES.passing)} or better)</span></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Subject</th><th scope="col">Sec</th><th scope="col" class="num">Units</th><th scope="col">Schedule</th><th scope="col">Slots</th><th scope="col"></th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </section>
        <section class="panel"><h3>Weekly schedule</h3>${timetable(e.sections)}</section>
      </div>
      <section class="panel">
        <h3>My enlistment</h3>
        ${
          e.sections.length
            ? `<dl class="kv">${e.sections.map((id) => `<div><dt>${esc(section(id).code)} <span class="mono">${id.split('-')[1]}</span></dt><dd>${subject(section(id).code).units} u</dd></div>`).join('')}
               <div class="total"><dt>Total load</dt><dd>${unitsOf(e.sections)} / ${RULES.maxUnits} units</dd></div></dl>`
            : '<p class="empty">No subjects yet. Add sections from the list.</p>'
        }
        ${editable ? select('Payment plan', 'plan', e.plan, [['installment', 'Installment · 30% down, 3 payments'], ['full', `Full payment · ${RULES.fullPaymentDiscount * 100}% off tuition`]]) : `<p class="muted">Payment plan: <strong>${e.plan === 'full' ? 'Full payment' : 'Installment'}</strong></p>`}
        <h3 class="mt">Assessment</h3>
        ${assessmentList(e.sections, e.plan)}
        ${
          editable
            ? `${checks(errors)}<div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="submit" ${errors.length ? 'disabled' : ''}>Submit for validation</button></div>`
            : e.status === 'pending'
              ? '<p class="note">Waiting for the registrar. Switch to <strong>Registrar</strong> above to validate it.</p>'
              : '<p class="check-ok">✓ You’re officially enrolled. See <strong>Assessment &amp; SOA</strong> for what’s due.</p>'
        }
      </section>
    </div>`;
}

function soaPanel(studentId: string) {
  const e = enlistment(studentId);
  const s = soa(studentId);
  const pays = D().payments.filter((p) => p.studentId === studentId);
  return `
    <div class="kpis">
      ${kpi('Total assessment', peso(s.total), e.plan === 'full' ? 'Full payment' : 'Installment plan')}
      ${kpi('Paid', peso(s.paid), plural(pays.length, 'payment'))}
      ${kpi('Balance', peso(s.balance), s.balance <= 0 ? 'Fully paid' : '')}
      ${kpi('Due now', peso(s.dueNow), s.next ? `Next: ${s.next.label}, ${fmtDate(s.next.due)}` : 'Nothing due')}
    </div>
    <div class="grid-2">
      <section class="panel">
        <h3>Payment schedule</h3>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Installment</th><th scope="col">Due</th><th scope="col" class="num">Amount</th><th scope="col" class="num">Paid</th><th scope="col">Status</th></tr></thead>
          <tbody>${s.dues.map((d) => `<tr><td>${d.label}</td><td>${fmtDate(d.due)}</td><td class="num">${money.format(d.amount)}</td><td class="num">${money.format(d.applied)}</td><td>${dueBadge(d.status)}</td></tr>`).join('')}</tbody>
        </table></div>
        <h3 class="mt">Payments</h3>
        ${
          pays.length
            ? `<div class="table-wrap"><table class="table"><thead><tr><th scope="col">OR no.</th><th scope="col">Date</th><th scope="col" class="num">Amount</th></tr></thead>
               <tbody>${pays.map((p) => `<tr><td class="mono">${p.or}</td><td>${fmtDateTime(p.at)}</td><td class="num">${money.format(p.amount)}</td></tr>`).join('')}</tbody></table></div>`
            : '<p class="empty">No payments yet.</p>'
        }
      </section>
      <section class="panel">
        <h3>Assessment</h3>
        ${assessmentList(e.sections, e.plan)}
        <h3 class="mt">Subjects</h3>
        <dl class="kv">${e.sections.map((id) => `<div><dt>${esc(section(id).code)} · ${esc(subject(section(id).code).title)}</dt><dd>${sched(section(id))}</dd></div>`).join('')}</dl>
      </section>
    </div>`;
}

function renderAccount() {
  const e = myEnlistment();
  const head = `<div class="view-head"><div><h1>Assessment &amp; statement of account</h1><p>${TERM}</p></div></div>`;
  if (e.status !== 'enrolled') {
    return `${head}<section class="panel"><p>Your statement of account opens once the registrar validates your enlistment.</p><p class="muted">Current status: ${statusBadge(e.status)}</p><div><button type="button" class="btn" data-view="registration">Go to registration</button></div></section>`;
  }
  return head + soaPanel(ME.student);
}

function renderGrades() {
  const st = student(ME.student);
  const e = myEnlistment();
  const gwa = (rows: PastTerm['grades']) => sum(rows.map(([, , u, g]) => u * g)) / sum(rows.map(([, , u]) => u));
  const all = st.history.flatMap((t) => t.grades);

  const current =
    e.status === 'enrolled'
      ? `<section class="panel">
          <div class="term-head"><h3>${TERM}</h3><span>Midterm grades</span></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Subject</th><th scope="col">Instructor</th><th scope="col" class="num">Units</th><th scope="col" class="num">Midterm</th></tr></thead>
            <tbody>${e.sections
              .map((id) => {
                const s = section(id);
                const g = D().grades[id]?.[st.id];
                const score = g ? midtermScore(g) : null;
                const shown = D().submitted.includes(id) && score != null ? fmtGrade(transmute(score)) : null;
                return `<tr><td><strong>${esc(s.code)}</strong> ${esc(subject(s.code).title)}</td><td>${esc(s.faculty)}</td><td class="num">${subject(s.code).units}</td><td class="num ${shown && Number(shown) > RULES.passing ? 'fail' : ''}">${shown ?? '<span class="muted">Not yet released</span>'}</td></tr>`;
              })
              .join('')}</tbody>
          </table></div>
        </section>`
      : '';

  return `
    <div class="view-head">
      <div><h1>Grades</h1><p>${esc(st.name)} · ${esc(st.program)}</p></div>
    </div>
    <div class="kpis">
      ${kpi('Cumulative GWA', fmtGrade(gwa(all)), '1.00 is the highest')}
      ${kpi('Units earned', String(sum(all.filter(([, , , g]) => g <= RULES.passing).map(([, , u]) => u))), `${all.length} subjects taken`)}
      ${kpi('Failed', String(all.filter(([, , , g]) => g > RULES.passing).length), all.some(([, , , g]) => g > RULES.passing) ? 'Retake before dependent subjects' : 'None')}
      ${kpi('Standing', st.year, 'Regular student')}
    </div>
    ${current}
    ${[...st.history]
      .reverse()
      .map(
        (t) => `<section class="panel">
          <div class="term-head"><h3>${t.term}</h3><span>GWA ${fmtGrade(gwa(t.grades))}</span></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Code</th><th scope="col">Subject</th><th scope="col" class="num">Units</th><th scope="col" class="num">Final grade</th><th scope="col">Remarks</th></tr></thead>
            <tbody>${t.grades.map(([c, title, u, g]) => `<tr><td class="mono">${c}</td><td>${esc(title)}</td><td class="num">${u}</td><td class="num ${g > RULES.passing ? 'fail' : ''}">${fmtGrade(g)}</td><td>${g > RULES.passing ? '<span class="badge badge-bad">Failed</span>' : '<span class="badge badge-good">Passed</span>'}</td></tr>`).join('')}</tbody>
          </table></div>
        </section>`,
      )
      .join('')}`;
}

/* ============================================================
 * Faculty view
 * ============================================================ */

function gradeRow(i: number, sectionId: string, st: { id: string; name: string }, locked: boolean) {
  const g = D().grades[sectionId]?.[st.id] ?? { prelim: null, midterm: null };
  const score = midtermScore(g);
  const input = (k: keyof Grade) =>
    `<input class="grade-input" type="number" min="0" max="100" step="1" inputmode="numeric" data-grade="${k}" data-student="${st.id}" value="${g[k] ?? ''}" ${locked ? 'disabled' : ''} aria-label="${k} score for ${esc(st.name)}" />`;
  return `<tr>
    <td class="muted">${i + 1}</td><td class="mono">${st.id}</td><td><strong>${esc(st.name)}</strong></td>
    <td class="num">${input('prelim')}</td><td class="num">${input('midterm')}</td>
    <td class="num" data-score="${st.id}">${gradeCells(score)}</td>
  </tr>`;
}

function gradeCells(score: number | null) {
  if (score == null) return '<span class="muted">Incomplete</span>';
  const g = transmute(score);
  return `${score} → <strong class="${g > RULES.passing ? 'fail' : ''}">${fmtGrade(g)}</strong>`;
}

function classStats(sectionId: string) {
  const scores = roster(sectionId).map((st) => {
    const g = D().grades[sectionId]?.[st.id];
    return g ? midtermScore(g) : null;
  });
  const done = scores.filter((s): s is number => s != null);
  return {
    total: scores.length,
    done: done.length,
    average: done.length ? round2(sum(done) / done.length) : 0,
    failing: done.filter((s) => transmute(s) > RULES.passing).length,
  };
}

function renderClasses() {
  const mine = SECTIONS.filter((s) => s.faculty === ME.faculty);
  const s = section(state.classId);
  const list = roster(s.id);
  const locked = D().submitted.includes(s.id);
  const stats = classStats(s.id);

  return `
    <div class="view-head">
      <div><h1>My classes</h1><p>${esc(ME.faculty)} · ${TERM}. Encode prelim and midterm scores; the midterm grade is 40% prelim + 60% midterm.</p></div>
    </div>
    <div class="tabs" role="tablist">
      ${mine.map((c) => `<button type="button" role="tab" data-class="${c.id}" aria-selected="${c.id === s.id}">${c.code} · ${c.id.split('-')[1]} ${D().submitted.includes(c.id) ? '✓' : ''}</button>`).join('')}
    </div>
    <div class="kpis" id="class-stats">${statsTiles(stats)}</div>
    <section class="panel">
      <div class="spread">
        <h3>${esc(subject(s.code).title)} <span class="muted">· ${sched(s)} · ${s.room}</span></h3>
        ${locked ? '<span class="badge badge-good">Submitted to registrar</span>' : `<button type="button" class="btn btn-primary" data-action="submit-grades" id="submit-grades" ${stats.done < stats.total ? 'disabled' : ''}>Submit midterm grades</button>`}
      </div>
      <div class="table-wrap table-scroll"><table class="table">
        <thead><tr><th scope="col">#</th><th scope="col">Student no.</th><th scope="col">Name</th><th scope="col" class="num">Prelim</th><th scope="col" class="num">Midterm</th><th scope="col" class="num">Midterm grade</th></tr></thead>
        <tbody>${list.map((st, i) => gradeRow(i, s.id, st, locked)).join('')}</tbody>
      </table></div>
      <p class="note" id="grade-note">${gradeNote(stats, locked)}</p>
    </section>`;
}

function gradeNote(s: ReturnType<typeof classStats>, locked: boolean) {
  if (locked) return 'Grades are locked. Students can see them now.';
  const missing = s.total - s.done;
  return missing
    ? `${plural(missing, 'student')} still missing a score. Every row needs both scores before you can submit.`
    : 'All scores are in. Submit to release them to students.';
}

const statsTiles = (s: ReturnType<typeof classStats>) =>
  [
    kpi('Students', String(s.total)),
    kpi('Encoded', `${s.done}/${s.total}`),
    kpi('Class average', s.done ? String(s.average) : '—', s.done ? `≈ ${fmtGrade(transmute(Math.round(s.average)))}` : ''),
    kpi('Failing', String(s.failing), 'Below 75'),
  ].join('');

/* ============================================================
 * Registrar views
 * ============================================================ */

function renderEnlistments() {
  const queue = D().enlistments.filter((e) => e.status === 'pending');
  const done = D().enlistments.filter((e) => e.status === 'enrolled' || e.status === 'returned');
  const card = (e: Enlistment) => {
    const st = student(e.studentId);
    const errors = enlistmentErrors(e);
    const a = assess(e.sections, e.plan);
    return `<section class="panel">
      <div class="spread">
        <div><strong>${esc(st.name)}</strong> <span class="mono muted">${st.id}</span><p class="muted small">${esc(st.program)}, ${st.year} · ${a.units} units · ${e.plan === 'full' ? 'Full payment' : 'Installment'} · ${peso(a.total)}</p></div>
        ${statusBadge(e.status)}
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Subject</th><th scope="col">Section</th><th scope="col">Schedule</th><th scope="col">Check</th></tr></thead>
        <tbody>${e.sections.map((id) => {
          const b = blocker(st, e.sections, id);
          return `<tr><td><strong>${esc(section(id).code)}</strong> ${esc(subject(section(id).code).title)}</td><td class="mono">${id}</td><td>${sched(section(id))}</td><td>${b ? `<span class="tag">${esc(b)}</span>` : '<span class="check-ok">✓</span>'}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
      ${last(e.history)?.remarks ? `<p class="note">Note: ${esc(last(e.history)!.remarks)}</p>` : ''}
      ${
        e.status !== 'pending'
          ? ''
          : state.returning === e.studentId
            ? `<div class="row"><label class="field"><span class="field-label">Reason for returning</span><input id="return-remarks" type="text" placeholder="Tell the student what to fix" /></label>
               <div class="btns"><button type="button" class="btn" data-action="cancel-return">Cancel</button><button type="button" class="btn btn-danger" data-action="confirm-return" data-id="${st.id}">Return to student</button></div></div>`
            : `<div class="spread"><span>${errors.length ? `<span class="tag">${plural(errors.length, 'issue')} · can’t validate</span>` : '<span class="check-ok">✓ All checks pass</span>'}</span>
               <div class="btns"><button type="button" class="btn" data-action="return" data-id="${st.id}">Return</button><button type="button" class="btn btn-primary" data-action="validate" data-id="${st.id}" ${errors.length ? 'disabled' : ''}>Validate &amp; enroll</button></div></div>`
      }
    </section>`;
  };
  return `
    <div class="view-head"><div><h1>Enlistments</h1><p>Validate each student’s subjects against prerequisites, schedule conflicts, slots and unit load before enrolling them.</p></div></div>
    <h3 class="muted small" style="text-transform:uppercase;letter-spacing:.06em">For validation · ${queue.length}</h3>
    ${queue.map(card).join('') || '<section class="panel"><p class="empty">Nothing waiting. 🎉 Switch to <strong>Student</strong> and submit an enlistment.</p></section>'}
    ${done.length ? `<h3 class="muted small" style="text-transform:uppercase;letter-spacing:.06em">Processed</h3>
      <section class="panel"><div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Student</th><th scope="col" class="num">Units</th><th scope="col">Status</th><th scope="col">Last action</th></tr></thead>
        <tbody>${done.map((e) => `<tr><td><strong>${esc(student(e.studentId).name)}</strong> <span class="mono muted">${e.studentId}</span></td><td class="num">${unitsOf(e.sections)}</td><td>${statusBadge(e.status)}</td><td>${esc(last(e.history)?.action ?? '')} · ${last(e.history) ? fmtDateTime(last(e.history)!.at) : ''}</td></tr>`).join('')}</tbody>
      </table></div></section>` : ''}`;
}

function renderAccounts() {
  const enrolled = D().enlistments.filter((e) => e.status === 'enrolled');
  if (!enrolled.some((e) => e.studentId === state.accountId)) state.accountId = enrolled[0]?.studentId ?? '';
  const st = state.accountId ? student(state.accountId) : null;
  return `
    <div class="view-head">
      <div><h1>Student accounts</h1><p>Statements of account for enrolled students. Payments are applied to the earliest installment first.</p></div>
      <div class="row">${select('Student', 'account', state.accountId, enrolled.map((e) => [e.studentId, `${student(e.studentId).name} · ${e.studentId}`]))}</div>
    </div>
    ${
      st
        ? `<section class="panel"><h3>Post a payment</h3>
            <div class="row">
              ${field('Amount', 'pay-amount', soa(st.id).dueNow || '', { type: 'number', attrs: 'id="pay-amount" min="1" step="0.01" inputmode="decimal"' })}
              <button type="button" class="btn btn-primary" data-action="pay">Post payment</button>
            </div></section>
           ${soaPanel(st.id)}`
        : '<section class="panel"><p class="empty">No enrolled students yet.</p></section>'
    }`;
}

function renderSections() {
  return `
    <div class="view-head"><div><h1>Sections</h1><p>${TERM} offerings and how full they are.</p></div></div>
    <section class="panel"><div class="table-wrap"><table class="table">
      <thead><tr><th scope="col">Section</th><th scope="col">Subject</th><th scope="col">Schedule</th><th scope="col">Room</th><th scope="col">Instructor</th><th scope="col">Enrolled</th><th scope="col">Grades</th></tr></thead>
      <tbody>${SECTIONS.map((s) => {
        const n = taken(s.id);
        return `<tr><td class="mono">${s.id}</td><td><strong>${esc(s.code)}</strong> ${esc(subject(s.code).title)}</td><td>${sched(s)}</td><td>${s.room}</td><td>${esc(s.faculty)}</td>
          <td><span class="fill"><span class="small">${n}/${s.slots}</span><span class="fill-bar ${n >= s.slots ? 'full' : ''}"><span style="width:${Math.min(100, (n / s.slots) * 100)}%"></span></span></span></td>
          <td>${D().submitted.includes(s.id) ? '<span class="badge badge-good">Midterm in</span>' : '<span class="badge badge-neutral">Pending</span>'}</td></tr>`;
      }).join('')}</tbody>
    </table></div></section>`;
}

/* ============================================================
 * Shell
 * ============================================================ */

function renderTopbar() {
  $('#term').textContent = SCHOOL;
  document.querySelectorAll<HTMLButtonElement>('[data-role]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === state.role)));
  const name = actor();
  const label = { student: 'Student', faculty: 'Faculty', registrar: 'Registrar' }[state.role];
  const initials = name.replace(/^(Prof|Dr|Engr)\. /, '').split(/[ .]+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('');
  $('#user').innerHTML = `<span class="avatar" aria-hidden="true">${esc(initials)}</span>${esc(name)} · <span class="muted">${label}</span>`;
}

function renderNav() {
  const labels: Record<View, string> = {
    registration: 'Registration', account: 'Assessment & SOA', grades: 'Grades',
    classes: 'My classes', enlistments: 'Enlistments', accounts: 'Student accounts', sections: 'Sections',
  };
  const counts: Partial<Record<View, number>> = {
    enlistments: D().enlistments.filter((e) => e.status === 'pending').length,
    classes: SECTIONS.filter((s) => s.faculty === ME.faculty && !D().submitted.includes(s.id)).length,
  };
  $('#nav').innerHTML = VIEWS[state.role]
    .map((v) => `<button type="button" data-view="${v}" ${state.view === v ? 'aria-current="page"' : ''}><span>${labels[v]}</span>${counts[v] ? `<span class="count">${counts[v]}</span>` : ''}</button>`)
    .join('');
}

const RENDER: Record<View, () => string> = {
  registration: renderRegistration, account: renderAccount, grades: renderGrades, classes: renderClasses,
  enlistments: renderEnlistments, accounts: renderAccounts, sections: renderSections,
};

function render() {
  renderTopbar();
  renderNav();
  $('#view').innerHTML = RENDER[state.view]();
}

function go(view: View) {
  state.view = view;
  state.returning = null;
  history.replaceState(null, '', `${location.pathname}#${view}`);
  render();
}

function commit(msg?: string) {
  persist();
  render();
  if (msg) toast(msg);
}

/* ============================================================
 * Events
 * ============================================================ */

document.addEventListener('click', (ev) => {
  const t = (ev.target as HTMLElement).closest<HTMLElement>('[data-action],[data-view],[data-role],[data-class]');
  if (!t) return;
  if (t.dataset.view) return go(t.dataset.view as View);
  if (t.dataset.role) {
    state.role = t.dataset.role as Role;
    persist();
    return go(VIEWS[state.role][0]);
  }
  if (t.dataset.class) {
    state.classId = t.dataset.class;
    return render();
  }

  const id = t.dataset.id ?? '';
  const e = myEnlistment();
  switch (t.dataset.action) {
    case 'add':
      if (!blocker(student(ME.student), e.sections, id)) {
        e.sections.push(id);
        commit();
      }
      break;
    case 'drop':
      e.sections = e.sections.filter((x) => x !== id);
      commit();
      break;
    case 'submit':
      if (enlistmentErrors(e).length) return;
      e.status = 'pending';
      e.history.push(stamp('Submitted enlistment'));
      commit('Submitted. Switch to Registrar to validate it.');
      break;
    case 'validate': {
      const en = enlistment(id);
      if (en.status !== 'pending' || enlistmentErrors(en).length) return;
      en.status = 'enrolled';
      en.enrolledAt = TODAY;
      en.history.push(stamp('Validated · officially enrolled'));
      state.accountId = id;
      commit(`${student(id).name} is officially enrolled`);
      break;
    }
    case 'return':
      state.returning = id;
      render();
      document.getElementById('return-remarks')?.focus();
      break;
    case 'cancel-return':
      state.returning = null;
      render();
      break;
    case 'confirm-return': {
      const input = document.getElementById('return-remarks') as HTMLInputElement | null;
      const remarks = input?.value.trim() ?? '';
      if (!remarks) {
        input?.setAttribute('aria-invalid', 'true');
        input?.focus();
        return;
      }
      const en = enlistment(id);
      en.status = 'returned';
      en.history.push(stamp('Returned', remarks));
      state.returning = null;
      commit(`Returned to ${student(id).name}`);
      break;
    }
    case 'pay': {
      const input = $<HTMLInputElement>('#pay-amount');
      const amount = round2(Number(input.value));
      const { balance } = soa(state.accountId);
      if (!(amount > 0) || amount > balance) {
        input.setAttribute('aria-invalid', 'true');
        toast(amount > balance ? `Amount is more than the ${peso(balance)} balance` : 'Enter an amount');
        return;
      }
      const last = Math.max(...D().payments.map((p) => Number(p.or.slice(3))), 105_000);
      const or = `OR-${last + 1}`;
      D().payments.push({ or, studentId: state.accountId, amount, at: new Date().toISOString(), by: 'Cashier' });
      commit(`${or} posted · ${peso(amount)}`);
      break;
    }
    case 'submit-grades': {
      if (classStats(state.classId).done < roster(state.classId).length) return;
      D().submitted.push(state.classId);
      commit(`${state.classId} midterm grades submitted`);
      break;
    }
    case 'reset':
      clearSaved(STORAGE_KEY);
      state.data = seed();
      state.classId = 'IT301-A';
      state.accountId = '2024-01045';
      state.role = 'student';
      go('registration');
      toast('Demo reset');
      break;
  }
});

document.addEventListener('input', (ev) => {
  const el = ev.target as HTMLInputElement;
  if (!el.dataset.grade) return;
  const raw = el.value.trim();
  const n = Number(raw);
  const valid = raw === '' || (Number.isInteger(n) && n >= 0 && n <= 100);
  el.setAttribute('aria-invalid', String(!valid));
  if (!valid) return;
  const sid = state.classId;
  D().grades[sid] ??= {};
  const g = (D().grades[sid][el.dataset.student!] ??= { prelim: null, midterm: null });
  g[el.dataset.grade as keyof Grade] = raw === '' ? null : n;
  persist();
  // Refresh the computed cells without re-rendering the inputs (keeps focus)
  document.querySelector(`[data-score="${el.dataset.student}"]`)!.innerHTML = gradeCells(midtermScore(g));
  const stats = classStats(sid);
  $('#class-stats').innerHTML = statsTiles(stats);
  const btn = document.getElementById('submit-grades') as HTMLButtonElement | null;
  if (btn) btn.disabled = stats.done < stats.total;
  $('#grade-note').textContent = gradeNote(stats, false);
});

document.addEventListener('change', (ev) => {
  const el = ev.target as HTMLSelectElement;
  if (el.dataset.field === 'plan') {
    myEnlistment().plan = el.value as Plan;
    commit();
  } else if (el.dataset.field === 'account') {
    state.accountId = el.value;
    render();
  }
});

document.addEventListener('keydown', (ev) => {
  const id = (ev.target as HTMLElement).id;
  if (ev.key !== 'Enter') return;
  if (id === 'return-remarks') document.querySelector<HTMLButtonElement>('[data-action="confirm-return"]')?.click();
  if (id === 'pay-amount') document.querySelector<HTMLButtonElement>('[data-action="pay"]')?.click();
});

window.addEventListener('hashchange', () => {
  const v = location.hash.slice(1) as View;
  if (VIEWS[state.role].includes(v) && v !== state.view) go(v);
});

render();
