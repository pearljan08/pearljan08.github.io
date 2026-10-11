import './style.css';
import { $, TODAY, addDays, checks, clearSaved, esc, field, fmtDate, fmtDateTime, iso, kpi, loadSaved, money, parse, peso, plural, round2, save, select, sum, toast } from '../shared/util';

/* ============================================================
 * Types
 * ============================================================ */

type Role = 'employee' | 'hr';
type View = 'dashboard' | 'people' | 'leave' | 'payroll' | 'supplies';
type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';
type LeaveType = 'VL' | 'SL' | 'LWOP';
type Kind = 'leave' | 'ot' | 'req';

interface Employee {
  id: string;
  name: string;
  position: string;
  dept: string;
  hired: string; // ISO date
  monthly: number;
  status: 'Regular' | 'Probationary';
  email: string;
  balances: { VL: number; SL: number };
}

interface Entry {
  at: string; // ISO datetime
  by: string;
  action: string;
  remarks?: string;
}

interface Leave {
  id: string;
  empId: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: Status;
  history: Entry[];
}

interface Overtime {
  id: string;
  empId: string;
  date: string;
  hours: number;
  reason: string;
  status: Status;
  history: Entry[];
}

interface Post {
  id: string;
  title: string;
  body: string;
  by: string;
  at: string;
  pinned?: boolean;
}

interface Item {
  code: string;
  name: string;
  unit: string;
  stock: number;
  reorder: number;
}

interface Requisition {
  id: string;
  empId: string;
  lines: { code: string; qty: number }[];
  purpose: string;
  status: Status;
  slip?: string;
  history: Entry[];
}

interface Data {
  employees: Employee[];
  leaves: Leave[];
  overtime: Overtime[];
  posts: Post[];
  items: Item[];
  reqs: Requisition[];
  /** Payroll cutoffs that have been locked, e.g. "2026-10-A" */
  locked: string[];
}

/* ============================================================
 * Rules (fictional, for the demo)
 * ============================================================ */

const RULES = {
  /** Working days per year, used to turn a monthly rate into a daily rate */
  workDaysPerYear: 261,
  otMultiplier: 1.25,
  maxOtHours: 4,
  /** Employee shares of government-style contributions (made-up rates) */
  socialRate: 0.045,
  socialCap: 30_000,
  healthRate: 0.025,
  housingFlat: 200,
  /** Sick leave can be filed up to this many days after the fact */
  slBackdateDays: 30,
};

const LEAVE_LABEL: Record<LeaveType, string> = { VL: 'Vacation leave', SL: 'Sick leave', LWOP: 'Leave without pay' };
const STATUS_LABEL: Record<Status, string> = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled' };
const STATUS_BADGE: Record<Status, string> = { pending: 'info', approved: 'good', rejected: 'bad', cancelled: 'neutral' };
const DEPTS = ['Finance', 'HR & Admin', 'IT', 'Operations'];

/** Who you are acting as in each role */
const ME: Record<Role, string> = { employee: 'EMP-0007', hr: 'EMP-0002' };

/* ============================================================
 * Dates
 * ============================================================ */

function holidaysOf(year: number): Record<string, string> {
  const h: Record<string, string> = {
    [`${year}-01-01`]: 'New Year’s Day',
    [`${year}-04-09`]: 'Day of Valor',
    [`${year}-05-01`]: 'Labor Day',
    [`${year}-06-12`]: 'Independence Day',
    [`${year}-08-21`]: 'Ninoy Aquino Day',
    [`${year}-11-01`]: 'All Saints’ Day',
    [`${year}-11-30`]: 'Bonifacio Day',
    [`${year}-12-08`]: 'Immaculate Conception',
    [`${year}-12-25`]: 'Christmas Day',
    [`${year}-12-30`]: 'Rizal Day',
    [`${year}-12-31`]: 'New Year’s Eve',
  };
  // National Heroes Day falls on the last Monday of August
  const d = new Date(year, 7, 31);
  while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
  h[iso(d)] = 'National Heroes Day';
  return h;
}

const holidayCache = new Map<number, Record<string, string>>();
function holiday(s: string): string | undefined {
  const y = Number(s.slice(0, 4));
  if (!holidayCache.has(y)) holidayCache.set(y, holidaysOf(y));
  return holidayCache.get(y)![s];
}

const isWorkday = (s: string) => {
  const day = parse(s).getDay();
  return day !== 0 && day !== 6 && !holiday(s);
};

/** Working days in a range: weekends and holidays don't count */
function workdays(from: string, to: string): string[] {
  const out: string[] = [];
  if (!from || !to || from > to) return out;
  for (let s = from, n = 0; s <= to && n < 400; s = addDays(s, 1), n++) {
    if (isWorkday(s)) out.push(s);
  }
  return out;
}

/** Semi-monthly cutoffs: A = 1st to 15th, B = 16th to month end */
interface Cutoff {
  key: string;
  from: string;
  to: string;
  label: string;
}

function cutoffOf(s: string): Cutoff {
  const d = parse(s);
  const y = d.getFullYear();
  const m = d.getMonth();
  const half = d.getDate() <= 15 ? 'A' : 'B';
  const from = half === 'A' ? iso(new Date(y, m, 1)) : iso(new Date(y, m, 16));
  const to = half === 'A' ? iso(new Date(y, m, 15)) : iso(new Date(y, m + 1, 0));
  return { key: `${s.slice(0, 7)}-${half}`, from, to, label: `${fmtDate(from, false)} – ${fmtDate(to)}` };
}

function recentCutoffs(): Cutoff[] {
  const now = cutoffOf(TODAY);
  const prev = cutoffOf(addDays(now.from, -1));
  const prev2 = cutoffOf(addDays(prev.from, -1));
  return [now, prev, prev2];
}

/* ============================================================
 * Formatting & helpers
 * ============================================================ */

const fmtRange = (a: string, b: string) => (a === b ? fmtDate(a) : `${fmtDate(a, false)} – ${fmtDate(b)}`);
const badge = (s: Status) => `<span class="badge badge-${STATUS_BADGE[s]}">${STATUS_LABEL[s]}</span>`;
const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

/* ============================================================
 * Seed data (all fictional; dates are relative to today)
 * ============================================================ */

function seed(): Data {
  const t = (n: number) => addDays(TODAY, n);
  const at = (n: number, time: string) => `${t(n)}T${time}:00`;
  const year = TODAY.slice(0, 4);

  const employees: Employee[] = [
    ['EMP-0001', 'Carlo Mendoza', 'Operations Manager', 'Operations', '2015-03-02', 85_000, 'Regular', 12, 9],
    ['EMP-0002', 'Rina Bautista', 'HR Officer', 'HR & Admin', '2017-07-10', 42_000, 'Regular', 10.5, 12],
    ['EMP-0003', 'Paolo Ramos', 'Accountant II', 'Finance', '2018-01-15', 38_500, 'Regular', 6, 8],
    ['EMP-0004', 'Jessa Lim', 'Payroll Specialist', 'Finance', '2019-05-06', 31_000, 'Regular', 9, 11],
    ['EMP-0005', 'Mark Villanueva', 'Systems Administrator', 'IT', '2016-09-01', 55_000, 'Regular', 4.5, 7],
    ['EMP-0006', 'Liza Gomez', 'Property Custodian', 'HR & Admin', '2020-02-17', 24_000, 'Regular', 8, 10],
    ['EMP-0007', 'Maria Santos', 'Operations Analyst', 'Operations', '2021-08-02', 33_000, 'Regular', 7.5, 9],
    ['EMP-0008', 'Kevin Tan', 'Software Developer', 'IT', '2022-04-18', 48_000, 'Regular', 3, 6],
    ['EMP-0009', 'Ana Reyes', 'Admin Assistant', 'HR & Admin', '2025-11-03', 19_500, 'Probationary', 1.5, 2],
    ['EMP-0010', 'Joel Cruz', 'Field Coordinator', 'Operations', '2023-06-05', 26_000, 'Regular', 0, 5],
  ].map(([id, name, position, dept, hired, monthly, status, VL, SL]) => ({
    id: id as string,
    name: name as string,
    position: position as string,
    dept: dept as string,
    hired: hired as string,
    monthly: monthly as number,
    status: status as Employee['status'],
    email: `${(name as string).toLowerCase().replace(/ /g, '.')}@kalinaw.example`,
    balances: { VL: VL as number, SL: SL as number },
  }));

  const leave = (id: string, empId: string, type: LeaveType, from: string, to: string, reason: string, status: Status, history: Entry[]): Leave => ({
    id, empId, type, from, to, reason, status, history, days: workdays(from, to).length,
  });

  return {
    employees,
    leaves: [
      leave('LV-0101', 'EMP-0008', 'VL', t(-1), t(1), 'Family trip', 'approved', [
        { at: at(-9, '09:10'), by: 'Kevin Tan', action: 'Filed vacation leave' },
        { at: at(-8, '10:02'), by: 'Rina Bautista', action: 'Approved' },
      ]),
      leave('LV-0102', 'EMP-0007', 'SL', t(-12), t(-12), 'Fever', 'approved', [
        { at: at(-11, '08:15'), by: 'Maria Santos', action: 'Filed sick leave' },
        { at: at(-11, '13:40'), by: 'Rina Bautista', action: 'Approved' },
      ]),
      leave('LV-0103', 'EMP-0003', 'VL', t(7), t(9), 'Out of town', 'pending', [
        { at: at(-1, '16:20'), by: 'Paolo Ramos', action: 'Filed vacation leave' },
      ]),
      leave('LV-0104', 'EMP-0010', 'LWOP', t(-3), t(-3), 'Personal errand', 'approved', [
        { at: at(-6, '11:00'), by: 'Joel Cruz', action: 'Filed leave without pay' },
        { at: at(-5, '09:30'), by: 'Rina Bautista', action: 'Approved' },
      ]),
      leave('LV-0105', 'EMP-0009', 'VL', t(2), t(4), 'Vacation', 'rejected', [
        { at: at(-4, '10:45'), by: 'Ana Reyes', action: 'Filed vacation leave' },
        { at: at(-3, '14:10'), by: 'Rina Bautista', action: 'Rejected', remarks: 'Only 1.5 days of VL left. File the rest as leave without pay.' },
      ]),
      leave('LV-0106', 'EMP-0007', 'VL', t(14), t(15), 'Sister’s wedding', 'pending', [
        { at: at(0, '08:05'), by: 'Maria Santos', action: 'Filed vacation leave' },
      ]),
    ],
    overtime: [
      { id: 'OT-0201', empId: 'EMP-0008', date: t(-2), hours: 3, reason: 'Production deploy', status: 'approved', history: [{ at: at(-2, '21:10'), by: 'Kevin Tan', action: 'Filed overtime' }, { at: at(-1, '09:00'), by: 'Rina Bautista', action: 'Approved' }] },
      { id: 'OT-0202', empId: 'EMP-0007', date: t(-4), hours: 2, reason: 'Month-end report', status: 'approved', history: [{ at: at(-4, '19:30'), by: 'Maria Santos', action: 'Filed overtime' }, { at: at(-3, '08:50'), by: 'Rina Bautista', action: 'Approved' }] },
      { id: 'OT-0203', empId: 'EMP-0004', date: t(-1), hours: 4, reason: 'Payroll reconciliation', status: 'pending', history: [{ at: at(-1, '22:05'), by: 'Jessa Lim', action: 'Filed overtime' }] },
      { id: 'OT-0204', empId: 'EMP-0007', date: t(-1), hours: 1.5, reason: 'Vendor call', status: 'pending', history: [{ at: at(-1, '19:15'), by: 'Maria Santos', action: 'Filed overtime' }] },
    ],
    posts: [
      { id: 'P-3', title: 'Quarterly town hall', body: 'All hands at the 5th floor training room, last Friday of the month, 3 PM. Bring questions for the leadership panel.', by: 'Rina Bautista', at: at(-2, '10:00'), pinned: true },
      { id: 'P-2', title: 'Leave filing reminder', body: 'Vacation leave has to be filed before it starts.\nSick leave can be filed when you get back, up to 30 days after.', by: 'Rina Bautista', at: at(-6, '15:30') },
      { id: 'P-1', title: 'Network maintenance on Saturday', body: 'VPN and shared drives will be down from 8 AM to 12 NN. Save your work Friday evening.', by: 'Mark Villanueva', at: at(-8, '17:45') },
    ],
    items: [
      { code: 'SUP-001', name: 'Bond paper, A4', unit: 'ream', stock: 42, reorder: 20 },
      { code: 'SUP-002', name: 'Ballpen, black', unit: 'box', stock: 6, reorder: 10 },
      { code: 'SUP-003', name: 'Printer toner', unit: 'cartridge', stock: 3, reorder: 4 },
      { code: 'SUP-004', name: 'Folder, long', unit: 'pack', stock: 25, reorder: 10 },
      { code: 'SUP-005', name: 'USB flash drive, 32 GB', unit: 'piece', stock: 8, reorder: 5 },
      { code: 'SUP-006', name: 'Isopropyl alcohol, 500 mL', unit: 'bottle', stock: 30, reorder: 12 },
    ],
    reqs: [
      { id: 'RQ-0301', empId: 'EMP-0007', lines: [{ code: 'SUP-001', qty: 2 }, { code: 'SUP-004', qty: 1 }], purpose: 'Monthly operations reports', status: 'approved', slip: `RIS-${year}-0042`, history: [{ at: at(-7, '09:20'), by: 'Maria Santos', action: 'Requested supplies' }, { at: at(-7, '11:05'), by: 'Rina Bautista', action: 'Approved and issued', remarks: `Issue slip RIS-${year}-0042` }] },
      { id: 'RQ-0302', empId: 'EMP-0008', lines: [{ code: 'SUP-005', qty: 2 }], purpose: 'Installer media for new laptops', status: 'pending', history: [{ at: at(-1, '14:30'), by: 'Kevin Tan', action: 'Requested supplies' }] },
      { id: 'RQ-0303', empId: 'EMP-0003', lines: [{ code: 'SUP-003', qty: 5 }, { code: 'SUP-001', qty: 3 }], purpose: 'Finance printer, quarter-end statements', status: 'pending', history: [{ at: at(0, '08:40'), by: 'Paolo Ramos', action: 'Requested supplies' }] },
    ],
    locked: [cutoffOf(addDays(cutoffOf(TODAY).from, -1)).key],
  };
}

/* ============================================================
 * State
 * ============================================================ */

const STORAGE_KEY = 'harbor-hris-demo-v1';
const VIEWS: View[] = ['dashboard', 'people', 'leave', 'payroll', 'supplies'];

interface LeaveDraft {
  type: LeaveType;
  from: string;
  to: string;
  reason: string;
}

interface State {
  data: Data;
  role: Role;
  view: View;
  calMonth: string; // first day of the month shown
  person: string; // selected employee on the People view
  search: string;
  dept: string;
  leaveTab: 'leave' | 'ot';
  leaveDraft: LeaveDraft;
  otDraft: { date: string; hours: number; reason: string };
  cutoff: string;
  payslip: string;
  cart: Record<string, number>;
  purpose: string;
  /** The approval being rejected, so its row can ask for a reason */
  rejecting: { kind: Kind; id: string } | null;
  slip: string | null; // requisition whose issue slip is open
}

function load(): Pick<State, 'data' | 'role'> {
  return loadSaved<Pick<State, 'data' | 'role'>>(STORAGE_KEY, (v) => !!v.data?.employees?.length) ?? { data: seed(), role: 'employee' };
}

const blankLeave = (): LeaveDraft => ({ type: 'VL', from: '', to: '', reason: '' });

const initial = load();
const params = new URLSearchParams(location.search);
const state: State = {
  data: initial.data,
  role: params.get('as') === 'hr' ? 'hr' : params.get('as') === 'employee' ? 'employee' : initial.role,
  view: VIEWS.includes(location.hash.slice(1) as View) ? (location.hash.slice(1) as View) : 'dashboard',
  calMonth: `${TODAY.slice(0, 8)}01`,
  person: ME.employee,
  search: '',
  dept: '',
  leaveTab: 'leave',
  leaveDraft: blankLeave(),
  otDraft: { date: TODAY, hours: 2, reason: '' },
  cutoff: cutoffOf(TODAY).key,
  payslip: ME.employee,
  cart: {},
  purpose: '',
  rejecting: null,
  slip: null,
};

const persist = () => save(STORAGE_KEY, { data: state.data, role: state.role });

const D = () => state.data;
const emp = (id: string) => D().employees.find((e) => e.id === id)!;
const me = () => emp(ME[state.role]);
const isHr = () => state.role === 'hr';
const stamp = (action: string, remarks?: string): Entry => ({ at: new Date().toISOString(), by: me().name, action, remarks });
const nextId = (prefix: string, ids: string[]) =>
  `${prefix}-${String(Math.max(0, ...ids.map((id) => Number(id.split('-').pop()))) + 1).padStart(4, '0')}`;

/** Overtime and unpaid leave can't land in a payroll period that's already locked */
const isLocked = (date: string) => D().locked.includes(cutoffOf(date).key);

const pendingCount = () =>
  D().leaves.filter((l) => l.status === 'pending').length +
  D().overtime.filter((o) => o.status === 'pending').length +
  D().reqs.filter((r) => r.status === 'pending').length;

/* ============================================================
 * Leave rules
 * ============================================================ */

function leaveChecks(empId: string, d: LeaveDraft) {
  const e = emp(empId);
  const days = workdays(d.from, d.to);
  const errors: string[] = [];
  if (!d.from || !d.to) errors.push('Pick the start and end dates.');
  else if (d.from > d.to) errors.push('The end date is before the start date.');
  else if (!days.length) errors.push('That range has no working days (weekends and holidays don’t count).');

  if (d.from && d.type !== 'SL' && d.from < TODAY) errors.push(`${LEAVE_LABEL[d.type]} has to be filed before it starts.`);
  if (d.from && d.type === 'SL' && d.from < addDays(TODAY, -RULES.slBackdateDays))
    errors.push(`Sick leave can only be filed up to ${RULES.slBackdateDays} days after the fact.`);

  let available = Infinity;
  if (d.type !== 'LWOP') {
    // Pending requests already spoken for count against the balance
    const held = sum(D().leaves.filter((l) => l.empId === empId && l.type === d.type && l.status === 'pending').map((l) => l.days));
    available = e.balances[d.type] - held;
    if (days.length > available) {
      errors.push(`Only ${available} day${available === 1 ? '' : 's'} of ${LEAVE_LABEL[d.type].toLowerCase()} available${held ? ` (${held} held by pending requests)` : ''}.`);
    }
  }

  const overlap = D().leaves.find(
    (l) => l.empId === empId && (l.status === 'pending' || l.status === 'approved') && d.from && d.to && l.from <= d.to && l.to >= d.from,
  );
  if (overlap) errors.push(`Overlaps ${overlap.id} (${fmtRange(overlap.from, overlap.to)}).`);
  if (d.type === 'LWOP' && days.some(isLocked)) errors.push('Payroll for part of that range is already locked.');
  if (!d.reason.trim()) errors.push('Add a reason.');

  return { days, available, errors };
}

function otChecks(empId: string, d: State['otDraft']) {
  const errors: string[] = [];
  if (!d.date) errors.push('Pick the date you worked overtime.');
  else if (d.date > TODAY) errors.push('Overtime is filed after it’s rendered, not before.');
  else if (isLocked(d.date)) errors.push('Payroll for that date is already locked.');
  if (!(d.hours > 0) || d.hours > RULES.maxOtHours) errors.push(`Hours must be between 0.5 and ${RULES.maxOtHours}.`);
  if (D().overtime.some((o) => o.empId === empId && o.date === d.date && o.status !== 'rejected' && o.status !== 'cancelled'))
    errors.push('You already filed overtime for that date.');
  if (!d.reason.trim()) errors.push('Add a reason.');
  return errors;
}

/* ============================================================
 * Payroll
 * ============================================================ */

/** Simplified semi-monthly withholding table (modeled on a graduated table; demo only) */
function withholding(taxable: number) {
  const brackets: [number, number, number][] = [
    // [over, base tax, rate on excess]
    [333_333, 91_770.7, 0.35],
    [83_333, 16_770.7, 0.3],
    [33_333, 4_270.7, 0.25],
    [16_667, 937.5, 0.2],
    [10_417, 0, 0.15],
  ];
  const b = brackets.find(([over]) => taxable > over);
  return b ? round2(b[1] + (taxable - b[0]) * b[2]) : 0;
}

function payslip(e: Employee, c: Cutoff) {
  const daily = (e.monthly * 12) / RULES.workDaysPerYear;
  const hourly = daily / 8;
  const basic = round2(e.monthly / 2);
  const otHours = sum(
    D().overtime.filter((o) => o.empId === e.id && o.status === 'approved' && o.date >= c.from && o.date <= c.to).map((o) => o.hours),
  );
  const otPay = round2(hourly * RULES.otMultiplier * otHours);
  const lwopDays = D()
    .leaves.filter((l) => l.empId === e.id && l.type === 'LWOP' && l.status === 'approved')
    .flatMap((l) => workdays(l.from, l.to))
    .filter((d) => d >= c.from && d <= c.to).length;
  const lwop = round2(daily * lwopDays);
  const gross = round2(basic + otPay - lwop);
  const social = round2((Math.min(e.monthly, RULES.socialCap) * RULES.socialRate) / 2);
  const health = round2((e.monthly * RULES.healthRate) / 2);
  const housing = RULES.housingFlat / 2;
  const taxable = round2(gross - social - health - housing);
  const tax = withholding(taxable);
  const deductions = round2(social + health + housing + tax);
  return { daily: round2(daily), hourly: round2(hourly), basic, otHours, otPay, lwopDays, lwop, gross, social, health, housing, taxable, tax, deductions, net: round2(gross - deductions) };
}

/* ============================================================
 * Rendering helpers
 * ============================================================ */

function approvalCell(kind: Kind, id: string, canApprove = true, why = '') {
  if (state.rejecting?.kind === kind && state.rejecting.id === id) {
    return `<div class="inline-input">
      <input id="reject-remarks" type="text" placeholder="Reason" aria-label="Reason for rejecting" />
      <button type="button" class="btn btn-sm btn-danger" data-action="confirm-reject">Reject</button>
      <button type="button" class="btn btn-sm" data-action="cancel-reject">Cancel</button>
    </div>`;
  }
  return `<div class="btns">
    <button type="button" class="btn btn-sm btn-primary" data-action="approve" data-kind="${kind}" data-id="${esc(id)}" ${canApprove ? '' : `disabled title="${esc(why)}"`}>Approve</button>
    <button type="button" class="btn btn-sm" data-action="reject" data-kind="${kind}" data-id="${esc(id)}">Reject</button>
  </div>`;
}

/* ============================================================
 * Views
 * ============================================================ */

function renderDashboard() {
  const leavesToday = D().leaves.filter((l) => l.status === 'approved' && l.from <= TODAY && l.to >= TODAY);
  const nextHoliday = (() => {
    for (let s = addDays(TODAY, 1), n = 0; n < 370; s = addDays(s, 1), n++) {
      const h = holiday(s);
      if (h) return { date: s, name: h };
    }
    return null;
  })();
  const mine = me();
  const myPending = D().leaves.filter((l) => l.empId === mine.id && l.status === 'pending').length + D().overtime.filter((o) => o.empId === mine.id && o.status === 'pending').length + D().reqs.filter((r) => r.empId === mine.id && r.status === 'pending').length;

  const kpis = isHr()
    ? [
        kpi('Headcount', String(D().employees.length), `${D().employees.filter((e) => e.status === 'Probationary').length} probationary`),
        kpi('On leave today', String(leavesToday.length), leavesToday.map((l) => emp(l.empId).name.split(' ')[0]).join(', ') || 'Everyone’s in'),
        kpi('Waiting for approval', String(pendingCount()), 'Leave, overtime and supplies'),
        kpi('Low-stock items', String(D().items.filter((i) => i.stock <= i.reorder).length), 'At or below reorder level'),
      ]
    : [
        kpi('Vacation leave', `${mine.balances.VL} d`, 'Available balance'),
        kpi('Sick leave', `${mine.balances.SL} d`, 'Available balance'),
        kpi('My pending requests', String(myPending), 'Leave, overtime and supplies'),
        kpi('Next holiday', nextHoliday ? fmtDate(nextHoliday.date, false) : '—', nextHoliday?.name ?? ''),
      ];

  return `
    <div class="view-head">
      <div><h1>Good day, ${esc(mine.name.split(' ')[0])}</h1><p>${parse(TODAY).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
    </div>
    <div class="kpis">${kpis.join('')}</div>
    <div class="grid-main">
      <section class="panel">${renderCalendar()}</section>
      <section class="panel">
        <h3>Bulletin board</h3>
        ${
          isHr()
            ? `<div class="stack" style="gap:8px">
                ${field('Title', 'post.title', '', { attrs: 'id="post-title" maxlength="80"' })}
                <label class="field"><span class="field-label">Message</span><textarea id="post-body" maxlength="600"></textarea></label>
                <div class="spread"><label class="small"><input type="checkbox" id="post-pin" /> Pin to top</label><button type="button" class="btn btn-sm btn-primary" data-action="post">Post</button></div>
              </div>`
            : ''
        }
        <ul class="posts">
          ${[...D().posts]
            .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at))
            .map(
              (p) => `<li class="post ${p.pinned ? 'pinned' : ''}">
                <div class="spread"><h4>${p.pinned ? '📌 ' : ''}${esc(p.title)}</h4>${isHr() ? `<button type="button" class="btn btn-sm" data-action="pin" data-id="${esc(p.id)}">${p.pinned ? 'Unpin' : 'Pin'}</button>` : ''}</div>
                <p>${esc(p.body)}</p>
                <p class="muted small">${esc(p.by)} · ${fmtDateTime(p.at)}</p>
              </li>`,
            )
            .join('')}
        </ul>
      </section>
    </div>`;
}

function renderCalendar() {
  const first = parse(state.calMonth);
  const y = first.getFullYear();
  const m = first.getMonth();
  const start = addDays(state.calMonth, -first.getDay());
  const last = new Date(y, m + 1, 0);
  const cells = Math.ceil((first.getDay() + last.getDate()) / 7) * 7;
  const nthWeekday = (weekday: number, n: number) => ((weekday - first.getDay() + 7) % 7) + 1 + (n - 1) * 7;
  const lastFriday = last.getDate() - ((last.getDay() - 5 + 7) % 7);
  const tasks: Record<number, string> = {
    [nthWeekday(1, 1)]: 'Ops team review',
    [nthWeekday(3, 2)]: 'Fire drill',
    15: 'Payroll cutoff',
    [lastFriday]: 'Town hall, 3 PM',
    [last.getDate()]: 'Payroll cutoff',
  };

  const days = Array.from({ length: cells }, (_, i) => {
    const s = addDays(start, i);
    const d = parse(s);
    const inMonth = d.getMonth() === m;
    const events: string[] = [];
    const h = holiday(s);
    if (h) events.push(`<span class="ev ev-holiday" title="${esc(h)}">${esc(h)}</span>`);
    if (inMonth && tasks[d.getDate()]) events.push(`<span class="ev ev-task">${tasks[d.getDate()]}</span>`);
    D()
      .leaves.filter((l) => l.status === 'approved' && l.from <= s && l.to >= s && isWorkday(s))
      .forEach((l) => {
        const who = emp(l.empId).name;
        events.push(`<span class="ev ev-leave" title="${esc(who)} · ${LEAVE_LABEL[l.type]}">${esc(who.split(' ')[0])} · ${l.type}</span>`);
      });
    const cls = [!inMonth && 'out', (d.getDay() === 0 || d.getDay() === 6) && 'weekend', s === TODAY && 'today'].filter(Boolean).join(' ');
    return `<div class="cal-day ${cls}"><span class="cal-num">${d.getDate()}</span>${events.join('')}</div>`;
  });

  return `
    <div class="cal-head">
      <h3>${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="-1" aria-label="Previous month">‹</button>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="0">Today</button>
      <button type="button" class="btn btn-sm" data-action="cal" data-step="1" aria-label="Next month">›</button>
    </div>
    <div class="cal">
      ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div class="cal-dow">${d}</div>`).join('')}
      ${days.join('')}
    </div>
    <div class="legend"><span><span class="ev ev-holiday">Holiday</span></span><span><span class="ev ev-leave">On leave</span></span><span><span class="ev ev-task">Task</span></span></div>`;
}

function renderPeople() {
  const q = state.search.trim().toLowerCase();
  const list = D().employees.filter(
    (e) => (!state.dept || e.dept === state.dept) && (!q || `${e.name} ${e.position} ${e.id}`.toLowerCase().includes(q)),
  );
  // Employees can look anyone up, but only HR (or the person themself) sees pay and leave details
  const canSee = (e: Employee) => isHr() || e.id === me().id;
  const p = emp(state.person);

  return `
    <div class="view-head">
      <div><h1>People</h1><p>${isHr() ? 'Employee records, with pay and leave details.' : 'Company directory. You can see your own pay and leave details.'}</p></div>
    </div>
    <div class="grid-main">
      <section class="panel">
        <div class="row">
          ${field('Search', 'search', state.search, { attrs: 'placeholder="Name, position or ID" id="search"' })}
          ${select('Department', 'dept', state.dept, [['', 'All departments'], ...DEPTS.map((d) => [d, d] as [string, string])])}
        </div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Position</th><th scope="col">Department</th><th scope="col">Status</th>${isHr() ? '<th scope="col" class="num">Monthly rate</th>' : ''}</tr></thead>
          <tbody>
            ${
              list
                .map(
                  (e) => `<tr data-open="person" data-id="${e.id}" aria-selected="${e.id === state.person}">
                    <td class="mono">${e.id}</td><td><strong>${esc(e.name)}</strong></td><td>${esc(e.position)}</td><td>${esc(e.dept)}</td>
                    <td><span class="badge badge-${e.status === 'Regular' ? 'good' : 'warn'}">${e.status}</span></td>
                    ${isHr() ? `<td class="num">${money.format(e.monthly)}</td>` : ''}
                  </tr>`,
                )
                .join('') || `<tr><td colspan="6" class="empty">No one matches.</td></tr>`
            }
          </tbody>
        </table></div>
        <p class="note">${plural(list.length, 'employee')}. Select a row to open the record.</p>
      </section>

      <section class="panel">
        <div class="profile-head">
          <span class="avatar" aria-hidden="true">${initials(p.name)}</span>
          <div><h3 style="text-transform:none;letter-spacing:0;color:var(--ink);font-size:16px">${esc(p.name)}</h3><p class="muted">${esc(p.position)} · ${esc(p.dept)}</p></div>
        </div>
        <dl class="kv">
          <div><dt>Employee ID</dt><dd class="mono">${p.id}</dd></div>
          <div><dt>Email</dt><dd>${esc(p.email)}</dd></div>
          <div><dt>Date hired</dt><dd>${fmtDate(p.hired)}</dd></div>
          <div><dt>Employment</dt><dd>${p.status}</dd></div>
          ${canSee(p) ? `<div><dt>Monthly rate</dt><dd class="num">${peso(p.monthly)}</dd></div><div><dt>Daily rate</dt><dd class="num">${peso(payslip(p, cutoffOf(TODAY)).daily)}</dd></div>` : ''}
        </dl>
        ${
          canSee(p)
            ? `<h3 class="mt">Leave balances</h3>
               <div class="balances"><div><span class="muted small">Vacation</span><strong>${p.balances.VL} d</strong></div><div><span class="muted small">Sick</span><strong>${p.balances.SL} d</strong></div></div>
               <h3 class="mt">Recent leave</h3>
               ${
                 D()
                   .leaves.filter((l) => l.empId === p.id)
                   .slice(-4)
                   .reverse()
                   .map((l) => `<div class="spread"><span>${l.type} · ${fmtRange(l.from, l.to)}</span>${badge(l.status)}</div>`)
                   .join('') || '<p class="empty">No leave filed.</p>'
               }`
            : `<p class="note">Pay and leave details are only visible to HR and to ${esc(p.name.split(' ')[0])}.</p>`
        }
      </section>
    </div>`;
}

function leaveRow(l: Leave, withEmp: boolean, actions: string) {
  const last = l.history[l.history.length - 1];
  return `<tr>
    <td class="mono">${l.id}</td>
    ${withEmp ? `<td><strong>${esc(emp(l.empId).name)}</strong><br><span class="muted small">${esc(emp(l.empId).dept)}</span></td>` : ''}
    <td>${l.type}</td>
    <td>${fmtRange(l.from, l.to)}</td>
    <td class="num">${l.days}</td>
    <td class="wrap">${esc(l.reason)}${last?.remarks ? `<br><span class="muted small">“${esc(last.remarks)}”</span>` : ''}</td>
    <td>${badge(l.status)}</td>
    <td>${actions}</td>
  </tr>`;
}

function otRow(o: Overtime, withEmp: boolean, actions: string) {
  const last = o.history[o.history.length - 1];
  return `<tr>
    <td class="mono">${o.id}</td>
    ${withEmp ? `<td><strong>${esc(emp(o.empId).name)}</strong></td>` : ''}
    <td>${fmtDate(o.date)}</td>
    <td class="num">${o.hours}</td>
    <td class="wrap">${esc(o.reason)}${last?.remarks ? `<br><span class="muted small">“${esc(last.remarks)}”</span>` : ''}</td>
    <td>${badge(o.status)}</td>
    <td>${actions}</td>
  </tr>`;
}

function renderLeave() {
  const tabs = `<div class="tabs" role="tablist">
    <button type="button" role="tab" data-leave-tab="leave" aria-selected="${state.leaveTab === 'leave'}">Leave</button>
    <button type="button" role="tab" data-leave-tab="ot" aria-selected="${state.leaveTab === 'ot'}">Overtime</button>
  </div>`;
  const head = `<div class="view-head"><div><h1>Leave &amp; overtime</h1><p>${isHr() ? 'Approve requests. Approved leave comes off the balance; approved overtime and unpaid leave flow into payroll.' : 'File leave and overtime, and track their status.'}</p></div></div>`;

  if (isHr()) {
    const ths = (cols: string[]) => `<thead><tr>${cols.map((c) => `<th scope="col" ${c === 'Days' || c === 'Hours' ? 'class="num"' : ''}>${c}</th>`).join('')}</tr></thead>`;
    if (state.leaveTab === 'leave') {
      const pending = D().leaves.filter((l) => l.status === 'pending');
      const done = D().leaves.filter((l) => l.status !== 'pending').reverse();
      return `${head}${tabs}
        <section class="panel"><h3>Waiting for approval <span class="muted">· ${pending.length}</span></h3>
          ${pending.length ? `<div class="table-wrap"><table class="table">${ths(['ID', 'Employee', 'Type', 'Dates', 'Days', 'Reason', 'Status', ''])}<tbody>
            ${pending
              .map((l) => {
                const e = emp(l.empId);
                const balance = l.type === 'LWOP' ? Infinity : e.balances[l.type];
                const short = l.days > balance;
                const locked = l.type === 'LWOP' && workdays(l.from, l.to).some(isLocked);
                const why = short ? `Balance is ${balance} d` : locked ? 'Payroll locked' : '';
                return leaveRow(l, true, approvalCell('leave', l.id, !why, why) + (why ? `<span class="tag">${why}</span>` : ''));
              })
              .join('')}
          </tbody></table></div>` : '<p class="empty">Nothing to approve. 🎉</p>'}
        </section>
        <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${ths(['ID', 'Employee', 'Type', 'Dates', 'Days', 'Reason', 'Status', ''])}<tbody>${done.map((l) => leaveRow(l, true, '')).join('')}</tbody></table></div></section>`;
    }
    const pending = D().overtime.filter((o) => o.status === 'pending');
    const done = D().overtime.filter((o) => o.status !== 'pending').reverse();
    return `${head}${tabs}
      <section class="panel"><h3>Waiting for approval <span class="muted">· ${pending.length}</span></h3>
        ${pending.length ? `<div class="table-wrap"><table class="table">${ths(['ID', 'Employee', 'Date', 'Hours', 'Reason', 'Status', ''])}<tbody>${pending.map((o) => otRow(o, true, approvalCell('ot', o.id, !isLocked(o.date), 'Payroll locked') + (isLocked(o.date) ? '<span class="tag">Payroll locked</span>' : ''))).join('')}</tbody></table></div>` : '<p class="empty">Nothing to approve. 🎉</p>'}
      </section>
      <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${ths(['ID', 'Employee', 'Date', 'Hours', 'Reason', 'Status', ''])}<tbody>${done.map((o) => otRow(o, true, '')).join('')}</tbody></table></div></section>`;
  }

  const mine = me();
  const cancel = (kind: Kind, id: string) => `<button type="button" class="btn btn-sm" data-action="cancel" data-kind="${kind}" data-id="${id}">Cancel</button>`;

  if (state.leaveTab === 'leave') {
    const d = state.leaveDraft;
    return `${head}${tabs}
      <div class="grid-main">
        <section class="panel">
          <h3>My leave requests</h3>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">ID</th><th scope="col">Type</th><th scope="col">Dates</th><th scope="col" class="num">Days</th><th scope="col">Reason</th><th scope="col">Status</th><th scope="col"></th></tr></thead>
            <tbody>${D().leaves.filter((l) => l.empId === mine.id).reverse().map((l) => leaveRow(l, false, l.status === 'pending' ? cancel('leave', l.id) : '')).join('') || '<tr><td colspan="7" class="empty">No requests yet.</td></tr>'}</tbody>
          </table></div>
        </section>
        <section class="panel">
          <h3>File leave</h3>
          <div class="balances"><div><span class="muted small">Vacation</span><strong>${mine.balances.VL} d</strong></div><div><span class="muted small">Sick</span><strong>${mine.balances.SL} d</strong></div></div>
          ${select('Type', 'leave.type', d.type, (Object.keys(LEAVE_LABEL) as LeaveType[]).map((k) => [k, LEAVE_LABEL[k]]))}
          <div class="row">
            ${field('From', 'leave.from', d.from, { type: 'date' })}
            ${field('To', 'leave.to', d.to, { type: 'date' })}
          </div>
          ${field('Reason', 'leave.reason', d.reason, { attrs: 'maxlength="120"' })}
          <div id="leave-preview">${renderLeavePreview()}</div>
        </section>
      </div>`;
  }

  const o = state.otDraft;
  return `${head}${tabs}
    <div class="grid-main">
      <section class="panel">
        <h3>My overtime</h3>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">ID</th><th scope="col">Date</th><th scope="col" class="num">Hours</th><th scope="col">Reason</th><th scope="col">Status</th><th scope="col"></th></tr></thead>
          <tbody>${D().overtime.filter((x) => x.empId === mine.id).reverse().map((x) => otRow(x, false, x.status === 'pending' ? cancel('ot', x.id) : '')).join('') || '<tr><td colspan="6" class="empty">No overtime filed.</td></tr>'}</tbody>
        </table></div>
      </section>
      <section class="panel">
        <h3>File overtime</h3>
        <div class="row">
          ${field('Date worked', 'ot.date', o.date, { type: 'date', attrs: `max="${TODAY}"` })}
          ${field('Hours', 'ot.hours', o.hours, { type: 'number', attrs: `min="0.5" max="${RULES.maxOtHours}" step="0.5" inputmode="decimal"` })}
        </div>
        ${field('Reason', 'ot.reason', o.reason, { attrs: 'maxlength="120"' })}
        <div id="ot-preview">${renderOtPreview()}</div>
      </section>
    </div>`;
}

function renderLeavePreview() {
  const { days, available, errors } = leaveChecks(me().id, state.leaveDraft);
  const skipped = state.leaveDraft.from && state.leaveDraft.to && state.leaveDraft.from <= state.leaveDraft.to
    ? workdays(state.leaveDraft.from, state.leaveDraft.to).length !== Math.round((parse(state.leaveDraft.to).getTime() - parse(state.leaveDraft.from).getTime()) / 864e5) + 1
    : false;
  return `
    <dl class="kv">
      <div><dt>Working days</dt><dd>${days.length}</dd></div>
      ${state.leaveDraft.type !== 'LWOP' ? `<div><dt>Balance after approval</dt><dd>${available - days.length} d</dd></div>` : `<div><dt>Salary deduction</dt><dd>${peso(payslip(me(), cutoffOf(TODAY)).daily * days.length)}</dd></div>`}
    </dl>
    ${skipped ? '<p class="note">Weekends and holidays in this range aren’t counted.</p>' : ''}
    ${checks(errors)}
    <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-leave" ${errors.length ? 'disabled' : ''}>Submit request</button></div>`;
}

function renderOtPreview() {
  const errors = otChecks(me().id, state.otDraft);
  const pay = payslip(me(), cutoffOf(TODAY));
  return `
    <dl class="kv">
      <div><dt>Hourly rate</dt><dd>${peso(pay.hourly)}</dd></div>
      <div><dt>Overtime pay (×${RULES.otMultiplier})</dt><dd>${peso(round2(pay.hourly * RULES.otMultiplier * (state.otDraft.hours || 0)))}</dd></div>
    </dl>
    ${checks(errors)}
    <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-ot" ${errors.length ? 'disabled' : ''}>Submit overtime</button></div>`;
}

function renderPayroll() {
  const cutoffs = recentCutoffs();
  const c = cutoffs.find((x) => x.key === state.cutoff) ?? cutoffs[0];
  const locked = D().locked.includes(c.key);
  const rows = D().employees.map((e) => ({ e, p: payslip(e, c) }));
  const selected = isHr() ? emp(state.payslip) : me();
  const ps = payslip(selected, c);
  const total = (k: keyof ReturnType<typeof payslip>) => money.format(sum(rows.map((r) => r.p[k] as number)));

  const slip = `
    <section class="panel">
      <div class="spread"><h3>Payslip</h3><button type="button" class="btn btn-sm no-print" data-action="print">Print</button></div>
      <div><strong>${esc(selected.name)}</strong><p class="muted small">${selected.id} · ${esc(selected.position)}</p><p class="muted small">Period: ${c.label}</p></div>
      <dl class="kv">
        <div><dt>Basic pay (½ of ${peso(selected.monthly)})</dt><dd class="num">${money.format(ps.basic)}</dd></div>
        <div><dt>Overtime · ${ps.otHours} h × ${money.format(ps.hourly)} × ${RULES.otMultiplier}</dt><dd class="num">${money.format(ps.otPay)}</dd></div>
        ${ps.lwopDays ? `<div><dt>Unpaid leave · ${plural(ps.lwopDays, 'day')}</dt><dd class="num">−${money.format(ps.lwop)}</dd></div>` : ''}
        <div class="total"><dt>Gross pay</dt><dd class="num">${money.format(ps.gross)}</dd></div>
        <div><dt>Social insurance</dt><dd class="num">${money.format(ps.social)}</dd></div>
        <div><dt>Health insurance</dt><dd class="num">${money.format(ps.health)}</dd></div>
        <div><dt>Housing fund</dt><dd class="num">${money.format(ps.housing)}</dd></div>
        <div><dt>Withholding tax</dt><dd class="num">${money.format(ps.tax)}</dd></div>
        <div class="total"><dt>Net pay</dt><dd class="num">${peso(ps.net)}</dd></div>
      </dl>
      <p class="note">Rates and the tax table are simplified and made up for the demo.</p>
    </section>`;

  return `
    <div class="view-head">
      <div><h1>Payroll</h1><p>Semi-monthly. Approved overtime and unpaid leave in the period are picked up automatically.</p></div>
      <div class="row no-print">
        ${select('Cutoff', 'cutoff', c.key, cutoffs.map((x) => [x.key, `${x.label}${D().locked.includes(x.key) ? ' · locked' : ''}`]))}
        ${isHr() ? `<button type="button" class="btn ${locked ? '' : 'btn-primary'}" data-action="lock" ${locked ? 'disabled' : ''}>${locked ? 'Locked' : 'Lock payroll'}</button>` : ''}
      </div>
    </div>
    ${
      isHr()
        ? `<div class="grid-main">
            <section class="panel no-print">
              <div class="spread"><h3>Payroll register</h3><span class="badge badge-${locked ? 'good' : 'warn'}">${locked ? 'Locked' : 'Open'}</span></div>
              <div class="table-wrap"><table class="table">
                <thead><tr><th scope="col">Employee</th><th scope="col" class="num">Basic</th><th scope="col" class="num">OT</th><th scope="col" class="num">Unpaid</th><th scope="col" class="num">Gross</th><th scope="col" class="num">Deductions</th><th scope="col" class="num">Net pay</th></tr></thead>
                <tbody>${rows
                  .map(
                    ({ e, p }) => `<tr data-open="payslip" data-id="${e.id}" aria-selected="${e.id === selected.id}">
                      <td><strong>${esc(e.name)}</strong><br><span class="muted small">${esc(e.position)}</span></td>
                      <td class="num">${money.format(p.basic)}</td><td class="num">${p.otPay ? money.format(p.otPay) : '—'}</td><td class="num">${p.lwop ? `−${money.format(p.lwop)}` : '—'}</td>
                      <td class="num">${money.format(p.gross)}</td><td class="num">${money.format(p.deductions)}</td><td class="num"><strong>${money.format(p.net)}</strong></td>
                    </tr>`,
                  )
                  .join('')}</tbody>
                <tfoot><tr><td>Total · ${plural(rows.length, 'employee')}</td><td class="num">${total('basic')}</td><td class="num">${total('otPay')}</td><td class="num">${total('lwop')}</td><td class="num">${total('gross')}</td><td class="num">${total('deductions')}</td><td class="num">${total('net')}</td></tr></tfoot>
              </table></div>
              <p class="note">${locked ? 'This cutoff is locked. Figures are final.' : 'Select a row to see the payslip. Lock the cutoff once figures are final.'}</p>
            </section>
            ${slip}
          </div>`
        : `<div class="grid-2">${slip}</div>`
    }`;
}

function reqErrors() {
  const item = (code: string) => D().items.find((i) => i.code === code)!;
  const lines = Object.entries(state.cart).filter(([, q]) => q > 0);
  const errors: string[] = [];
  if (!lines.length) errors.push('Add at least one item.');
  lines.forEach(([code, q]) => {
    if (q > item(code).stock) errors.push(`Only ${item(code).stock} ${item(code).unit} of ${item(code).name} in stock.`);
  });
  if (!state.purpose.trim()) errors.push('Add a purpose.');
  return errors;
}

/** Refresh the requisition checks without re-rendering the inputs (keeps focus) */
function refreshReqChecks() {
  const errors = reqErrors();
  $('#req-checks').innerHTML = checks(errors);
  $<HTMLButtonElement>('#file-req').disabled = errors.length > 0;
}

function renderSupplies() {
  const items = D().items;
  const item = (code: string) => items.find((i) => i.code === code)!;
  const shortOf = (r: Requisition) => r.lines.filter((l) => item(l.code).stock < l.qty);
  const lines = (r: Requisition) => r.lines.map((l) => `${l.qty} ${item(l.code).unit} ${esc(item(l.code).name)}`).join('<br>');
  const reqRow = (r: Requisition, actions: string) => `<tr>
    <td class="mono">${r.id}</td>${isHr() ? `<td><strong>${esc(emp(r.empId).name)}</strong></td>` : ''}
    <td class="wrap">${lines(r)}</td><td class="wrap">${esc(r.purpose)}</td><td>${badge(r.status)}</td><td>${actions}</td></tr>`;
  const slipBtn = (r: Requisition) => (r.slip ? `<button type="button" class="btn btn-sm" data-action="slip" data-id="${r.id}">${r.slip}</button>` : '');
  const head = `<thead><tr><th scope="col">ID</th>${isHr() ? '<th scope="col">Requested by</th>' : ''}<th scope="col">Items</th><th scope="col">Purpose</th><th scope="col">Status</th><th scope="col"></th></tr></thead>`;

  const open = state.slip ? D().reqs.find((r) => r.id === state.slip) : null;
  const slipDoc = open?.slip
    ? `<section class="doc">
        <div class="doc-head">
          <div><p class="muted small">Kalinaw Holdings (demo) · Property and Supply</p><h2>Requisition and Issue Slip</h2></div>
          <div style="text-align:right"><p class="mono">${open.slip}</p><p class="muted small">${fmtDateTime(open.history[open.history.length - 1].at)}</p></div>
        </div>
        <dl class="kv"><div><dt>Requested by</dt><dd>${esc(emp(open.empId).name)} · ${esc(emp(open.empId).dept)}</dd></div><div><dt>Purpose</dt><dd>${esc(open.purpose)}</dd></div></dl>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Stock no.</th><th scope="col">Description</th><th scope="col">Unit</th><th scope="col" class="num">Requested</th><th scope="col" class="num">Issued</th></tr></thead>
          <tbody>${open.lines.map((l) => `<tr><td class="mono">${l.code}</td><td>${esc(item(l.code).name)}</td><td>${item(l.code).unit}</td><td class="num">${l.qty}</td><td class="num">${l.qty}</td></tr>`).join('')}</tbody>
        </table></div>
        <div class="signatures">
          <div><strong>${esc(emp(open.empId).name)}</strong>Requested by</div>
          <div><strong>${esc(open.history.find((h) => h.action.startsWith('Approved'))?.by ?? '')}</strong>Approved by</div>
          <div><strong>Liza Gomez</strong>Issued by</div>
        </div>
        <div class="btns no-print"><button type="button" class="btn btn-primary" data-action="print">Print slip</button><button type="button" class="btn" data-action="close-slip">Close</button></div>
      </section>`
    : '';

  if (isHr()) {
    const pending = D().reqs.filter((r) => r.status === 'pending');
    return `
      <div class="view-head"><div><h1>Supplies</h1><p>Approve requisitions. Approving issues the items, takes them off stock and creates an issue slip.</p></div></div>
      ${slipDoc}
      <div class="grid-main">
        <div class="stack">
          <section class="panel"><h3>Waiting for approval <span class="muted">· ${pending.length}</span></h3>
            ${pending.length ? `<div class="table-wrap"><table class="table">${head}<tbody>${pending.map((r) => {
              const short = shortOf(r);
              return reqRow(r, approvalCell('req', r.id, !short.length, 'Not enough stock') + (short.length ? `<span class="tag">Short: ${short.map((l) => esc(item(l.code).name)).join(', ')}</span>` : ''));
            }).join('')}</tbody></table></div>` : '<p class="empty">Nothing to approve. 🎉</p>'}
          </section>
          <section class="panel"><h3>Decided</h3><div class="table-wrap"><table class="table">${head}<tbody>${D().reqs.filter((r) => r.status !== 'pending').reverse().map((r) => reqRow(r, slipBtn(r))).join('') || `<tr><td colspan="6" class="empty">None yet.</td></tr>`}</tbody></table></div></section>
        </div>
        <section class="panel">
          <h3>Inventory</h3>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Item</th><th scope="col" class="num">On hand</th><th scope="col"></th></tr></thead>
            <tbody>${items.map((i) => `<tr><td>${esc(i.name)}<br><span class="muted small mono">${i.code} · per ${i.unit}</span></td><td class="num">${i.stock}</td><td>${i.stock <= i.reorder ? '<span class="badge badge-warn">Reorder</span>' : ''}</td></tr>`).join('')}</tbody>
          </table></div>
          <button type="button" class="btn btn-sm" data-action="restock">Receive delivery (+20 each low item)</button>
        </section>
      </div>`;
  }

  const errors = reqErrors();

  return `
    <div class="view-head"><div><h1>Supplies</h1><p>Request office supplies. Property approves and issues them with a requisition and issue slip.</p></div></div>
    ${slipDoc}
    <div class="grid-main">
      <section class="panel">
        <h3>My requisitions</h3>
        <div class="table-wrap"><table class="table">${head}<tbody>${D().reqs.filter((r) => r.empId === me().id).reverse().map((r) => reqRow(r, r.status === 'pending' ? `<button type="button" class="btn btn-sm" data-action="cancel" data-kind="req" data-id="${r.id}">Cancel</button>` : slipBtn(r))).join('') || '<tr><td colspan="5" class="empty">No requisitions yet.</td></tr>'}</tbody></table></div>
      </section>
      <section class="panel">
        <h3>New requisition</h3>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Item</th><th scope="col" class="num">In stock</th><th scope="col" class="num">Qty</th></tr></thead>
          <tbody>${items.map((i) => `<tr><td>${esc(i.name)}<br><span class="muted small">per ${i.unit}</span></td><td class="num">${i.stock}</td><td class="num"><input class="qty" type="number" min="0" max="99" step="1" inputmode="numeric" data-cart="${i.code}" value="${state.cart[i.code] ?? 0}" aria-label="Quantity of ${esc(i.name)}" /></td></tr>`).join('')}</tbody>
        </table></div>
        ${field('Purpose', 'purpose', state.purpose, { attrs: 'maxlength="120"' })}
        <div id="req-checks">${checks(errors)}</div>
        <div class="btns" style="justify-content:flex-end"><button type="button" class="btn btn-primary" data-action="file-req" id="file-req" ${errors.length ? 'disabled' : ''}>Submit requisition</button></div>
      </section>
    </div>`;
}

/* ============================================================
 * Shell
 * ============================================================ */

function renderTopbar() {
  document.querySelectorAll<HTMLButtonElement>('[data-role]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === state.role)));
  const m = me();
  $('#user').innerHTML = `<span class="avatar" aria-hidden="true">${initials(m.name)}</span>${esc(m.name)} · <span class="muted">${isHr() ? 'HR admin' : 'Employee'}</span>`;
}

function renderNav() {
  const items: [View, string, number][] = [
    ['dashboard', 'Dashboard', 0],
    ['people', isHr() ? 'Employees' : 'People', 0],
    ['leave', 'Leave & overtime', isHr() ? D().leaves.filter((l) => l.status === 'pending').length + D().overtime.filter((o) => o.status === 'pending').length : 0],
    ['payroll', isHr() ? 'Payroll' : 'My payslip', 0],
    ['supplies', 'Supplies', isHr() ? D().reqs.filter((r) => r.status === 'pending').length : 0],
  ];
  $('#nav').innerHTML = items
    .map(([v, label, n]) => `<button type="button" data-view="${v}" ${state.view === v ? 'aria-current="page"' : ''}><span>${label}</span>${n ? `<span class="count" aria-label="${n} pending">${n}</span>` : ''}</button>`)
    .join('');
}

function renderView() {
  $('#view').innerHTML = { dashboard: renderDashboard, people: renderPeople, leave: renderLeave, payroll: renderPayroll, supplies: renderSupplies }[state.view]();
}

function render() {
  renderTopbar();
  renderNav();
  renderView();
}

function commit(msg?: string) {
  persist();
  render();
  if (msg) toast(msg);
}

/* ============================================================
 * Actions
 * ============================================================ */

function find(kind: Kind, id: string) {
  return (kind === 'leave' ? D().leaves : kind === 'ot' ? D().overtime : D().reqs).find((x) => x.id === id) as Leave | Overtime | Requisition | undefined;
}

function approve(kind: Kind, id: string) {
  const rec = find(kind, id);
  if (!rec || rec.status !== 'pending') return;
  if (kind === 'leave') {
    const l = rec as Leave;
    const e = emp(l.empId);
    if (l.type === 'LWOP' && workdays(l.from, l.to).some(isLocked)) return;
    if (l.type !== 'LWOP') {
      if (l.days > e.balances[l.type]) return;
      e.balances[l.type] = round2(e.balances[l.type] - l.days);
    }
    l.status = 'approved';
    l.history.push(stamp('Approved'));
    commit(`${l.id} approved · ${e.name.split(' ')[0]}’s ${l.type} is now ${l.type === 'LWOP' ? 'set' : `${e.balances[l.type]} d`}`);
  } else if (kind === 'ot') {
    if (isLocked((rec as Overtime).date)) return;
    rec.status = 'approved';
    rec.history.push(stamp('Approved'));
    commit(`${rec.id} approved · added to payroll`);
  } else {
    const r = rec as Requisition;
    const short = r.lines.some((l) => D().items.find((i) => i.code === l.code)!.stock < l.qty);
    if (short) return;
    r.lines.forEach((l) => (D().items.find((i) => i.code === l.code)!.stock -= l.qty));
    const year = TODAY.slice(0, 4);
    const used = D().reqs.map((x) => x.slip).filter((s): s is string => !!s?.startsWith(`RIS-${year}`));
    r.slip = nextId(`RIS-${year}`, used);
    r.status = 'approved';
    r.history.push(stamp('Approved and issued', `Issue slip ${r.slip}`));
    state.slip = r.id;
    commit(`${r.id} issued · ${r.slip}`);
  }
}

document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-action],[data-view],[data-role],[data-open],[data-leave-tab]');
  if (!t) return;

  if (t.dataset.view) {
    state.view = t.dataset.view as View;
    state.rejecting = null;
    state.slip = null;
    history.replaceState(null, '', `${location.pathname}#${state.view}`);
    renderNav();
    renderView();
    return;
  }
  if (t.dataset.role) {
    state.role = t.dataset.role as Role;
    state.rejecting = null;
    state.person = ME[state.role];
    state.payslip = ME[state.role];
    history.replaceState(null, '', `${location.pathname}#${state.view}`);
    commit();
    return;
  }
  if (t.dataset.leaveTab) {
    state.leaveTab = t.dataset.leaveTab as State['leaveTab'];
    state.rejecting = null;
    renderView();
    return;
  }
  if (t.dataset.open) {
    if (t.dataset.open === 'person') state.person = t.dataset.id!;
    else state.payslip = t.dataset.id!;
    renderView();
    return;
  }

  const { kind, id } = t.dataset as { kind?: Kind; id?: string };
  switch (t.dataset.action) {
    case 'cal': {
      const step = Number(t.dataset.step);
      const d = parse(state.calMonth);
      state.calMonth = step === 0 ? `${TODAY.slice(0, 8)}01` : iso(new Date(d.getFullYear(), d.getMonth() + step, 1));
      renderView();
      break;
    }
    case 'post': {
      const title = $<HTMLInputElement>('#post-title').value.trim();
      const body = $<HTMLTextAreaElement>('#post-body').value.trim();
      if (!title || !body) {
        toast('Add a title and a message');
        return;
      }
      D().posts.push({ id: nextId('P', D().posts.map((p) => p.id)), title, body, by: me().name, at: new Date().toISOString(), pinned: $<HTMLInputElement>('#post-pin').checked });
      commit('Posted to the bulletin board');
      break;
    }
    case 'pin': {
      const p = D().posts.find((x) => x.id === id);
      if (p) p.pinned = !p.pinned;
      commit();
      break;
    }
    case 'file-leave': {
      const d = state.leaveDraft;
      const { days, errors } = leaveChecks(me().id, d);
      if (errors.length) return;
      const l: Leave = { id: nextId('LV', D().leaves.map((x) => x.id)), empId: me().id, type: d.type, from: d.from, to: d.to, days: days.length, reason: d.reason.trim(), status: 'pending', history: [stamp(`Filed ${LEAVE_LABEL[d.type].toLowerCase()}`)] };
      D().leaves.push(l);
      state.leaveDraft = blankLeave();
      commit(`${l.id} filed. Switch to HR admin to approve it.`);
      break;
    }
    case 'file-ot': {
      const d = state.otDraft;
      if (otChecks(me().id, d).length) return;
      const o: Overtime = { id: nextId('OT', D().overtime.map((x) => x.id)), empId: me().id, date: d.date, hours: d.hours, reason: d.reason.trim(), status: 'pending', history: [stamp('Filed overtime')] };
      D().overtime.push(o);
      state.otDraft = { date: TODAY, hours: 2, reason: '' };
      commit(`${o.id} filed`);
      break;
    }
    case 'file-req': {
      const lines = Object.entries(state.cart).filter(([, q]) => q > 0).map(([code, qty]) => ({ code, qty }));
      if (reqErrors().length) return;
      const r: Requisition = { id: nextId('RQ', D().reqs.map((x) => x.id)), empId: me().id, lines, purpose: state.purpose.trim(), status: 'pending', history: [stamp('Requested supplies')] };
      D().reqs.push(r);
      state.cart = {};
      state.purpose = '';
      commit(`${r.id} submitted`);
      break;
    }
    case 'cancel': {
      const rec = kind && id ? find(kind, id) : undefined;
      if (rec?.status === 'pending') {
        rec.status = 'cancelled';
        rec.history.push(stamp('Cancelled'));
        commit(`${rec.id} cancelled`);
      }
      break;
    }
    case 'approve':
      if (kind && id) approve(kind, id);
      break;
    case 'reject':
      if (kind && id) state.rejecting = { kind, id };
      renderView();
      document.getElementById('reject-remarks')?.focus();
      break;
    case 'cancel-reject':
      state.rejecting = null;
      renderView();
      break;
    case 'confirm-reject': {
      const input = document.getElementById('reject-remarks') as HTMLInputElement | null;
      const remarks = input?.value.trim() ?? '';
      if (!remarks || !state.rejecting) {
        input?.setAttribute('aria-invalid', 'true');
        input?.focus();
        return;
      }
      const rec = find(state.rejecting.kind, state.rejecting.id);
      state.rejecting = null;
      if (rec) {
        rec.status = 'rejected';
        rec.history.push(stamp('Rejected', remarks));
        commit(`${rec.id} rejected`);
      }
      break;
    }
    case 'lock': {
      const c = cutoffOf(state.cutoff.endsWith('A') ? `${state.cutoff.slice(0, 7)}-01` : `${state.cutoff.slice(0, 7)}-16`);
      if (!D().locked.includes(c.key)) D().locked.push(c.key);
      commit(`Payroll for ${c.label} locked`);
      break;
    }
    case 'restock':
      D().items.forEach((i) => {
        if (i.stock <= i.reorder) i.stock += 20;
      });
      commit('Delivery received');
      break;
    case 'slip':
      state.slip = id ?? null;
      renderView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'close-slip':
      state.slip = null;
      renderView();
      break;
    case 'print':
      window.print();
      break;
    case 'reset':
      clearSaved(STORAGE_KEY);
      Object.assign(state, { data: seed(), role: 'employee', person: ME.employee, payslip: ME.employee, leaveDraft: blankLeave(), cart: {}, purpose: '', rejecting: null, slip: null });
      commit('Demo reset');
      break;
  }
});

document.addEventListener('input', (e) => {
  const el = e.target as HTMLInputElement;
  const name = el.dataset.field;
  if (el.dataset.cart) {
    state.cart[el.dataset.cart] = Math.max(0, Math.floor(Number(el.value) || 0));
    refreshReqChecks();
    return;
  }
  if (!name || el.tagName === 'SELECT') return;

  if (name === 'search') {
    state.search = el.value;
    renderView();
    const s = $<HTMLInputElement>('#search');
    s.focus();
    s.setSelectionRange(s.value.length, s.value.length);
  } else if (name.startsWith('leave.')) {
    const key = name.slice(6) as 'from' | 'to' | 'reason';
    state.leaveDraft[key] = el.value;
    // Picking a start date first: default the end date to the same day
    if (key === 'from' && (!state.leaveDraft.to || state.leaveDraft.to < el.value)) {
      state.leaveDraft.to = el.value;
      const to = document.querySelector<HTMLInputElement>('[data-field="leave.to"]');
      if (to) to.value = el.value;
    }
    $('#leave-preview').innerHTML = renderLeavePreview();
  } else if (name.startsWith('ot.')) {
    const key = name.slice(3) as 'date' | 'hours' | 'reason';
    if (key === 'hours') state.otDraft.hours = Number(el.value);
    else state.otDraft[key] = el.value;
    $('#ot-preview').innerHTML = renderOtPreview();
  } else if (name === 'purpose') {
    state.purpose = el.value;
    refreshReqChecks();
  }
});

document.addEventListener('change', (e) => {
  const el = e.target as HTMLSelectElement;
  if (el.tagName !== 'SELECT') return;
  const name = el.dataset.field;
  if (name === 'dept') state.dept = el.value;
  else if (name === 'leave.type') state.leaveDraft.type = el.value as LeaveType;
  else if (name === 'cutoff') state.cutoff = el.value;
  else return;
  renderView();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.target as HTMLElement).id === 'reject-remarks') {
    document.querySelector<HTMLButtonElement>('[data-action="confirm-reject"]')?.click();
  }
});

window.addEventListener('hashchange', () => {
  const v = location.hash.slice(1) as View;
  if (VIEWS.includes(v) && v !== state.view) {
    state.view = v;
    renderNav();
    renderView();
  }
});

render();
