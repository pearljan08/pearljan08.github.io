import './style.css';

/* ============================================================
 * Types
 * ============================================================ */

type Status = 'draft' | 'pending' | 'approved' | 'returned';
type LoanType = 'new' | 'reloan';
type Role = 'maker' | 'checker';
type Tab = 'loan' | 'borrower' | 'schedule' | 'history';

interface ExistingLoan {
  account: string;
  released: string; // ISO date
  amount: number;
  term: number;
  paid: number; // installments paid
}

interface Borrower {
  name: string;
  employeeId: string;
  position: string;
  agency: string;
  employedSince: string;
  mobile: string;
  coName: string;
  coRelation: string;
}

interface Entry {
  at: string; // ISO datetime
  by: string;
  action: string;
  remarks?: string;
}

interface Application {
  id: string;
  status: Status;
  type: LoanType;
  term: number;
  amount: number;
  nthp: number; // current monthly net take-home pay
  borrower: Borrower;
  existing: ExistingLoan[];
  payoff: string[]; // accounts to pay off with this re-loan
  history: Entry[];
}

/* ============================================================
 * Business rules (fictional, for the demo)
 * ============================================================ */

const RULES = {
  /** Monthly add-on rate by term */
  rates: { 12: 0.0075, 24: 0.008, 36: 0.0083, 48: 0.0085 } as Record<number, number>,
  serviceFee: 0.01,
  processingFee: 0.02,
  /** Documentary stamp: ₱1.50 per ₱200 */
  docStampPer200: 1.5,
  /** Take-home pay must stay at or above this after the new deduction */
  nthpFloor: 5000,
  minAmount: 10_000,
  maxAmount: 300_000,
  /** Share of an existing loan's term that must be paid before it can be re-loaned */
  reloanPaidRatio: 0.3,
};
const TERMS = [12, 24, 36, 48];

const USERS: Record<Role, string> = { maker: 'j.reyes', checker: 'a.lim' };

const STATUS_LABEL: Record<Status, string> = {
  draft: 'Draft',
  pending: 'For approval',
  approved: 'Approved',
  returned: 'Returned',
};

/* ============================================================
 * Computations
 * ============================================================ */

const round2 = (n: number) => Math.round(n * 100) / 100;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

function existingFigures(l: ExistingLoan) {
  const rate = RULES.rates[l.term] ?? RULES.rates[36];
  const interest = l.amount * rate * l.term;
  const amort = (l.amount + interest) / l.term;
  const remaining = l.term - l.paid;
  const balance = amort * remaining;
  // Rule of 78: unearned interest is refunded in proportion to the remaining "sum of digits"
  const rebate = (interest * (remaining * (remaining + 1))) / (l.term * (l.term + 1));
  return {
    amort: round2(amort),
    balance: round2(balance),
    rebate: round2(rebate),
    payoff: round2(balance - rebate),
    eligible: l.paid / l.term >= RULES.reloanPaidRatio,
  };
}

interface Computation {
  rate: number;
  interest: number;
  amort: number;
  serviceFee: number;
  processingFee: number;
  docStamp: number;
  oldBalance: number;
  rebate: number;
  payoff: number;
  freed: number;
  nthpAfter: number;
  maxLoanable: number;
  net: number;
  errors: string[];
}

function compute(app: Application): Computation {
  const rate = RULES.rates[app.term];
  const amount = Number.isFinite(app.amount) ? app.amount : 0;
  const interest = round2(amount * rate * app.term);
  const amort = round2((amount + interest) / app.term);
  const serviceFee = round2(amount * RULES.serviceFee);
  const processingFee = round2(amount * RULES.processingFee);
  const docStamp = Math.ceil(amount / 200) * RULES.docStampPer200;

  const selected = app.type === 'reloan' ? app.existing.filter((l) => app.payoff.includes(l.account)) : [];
  const figs = selected.map(existingFigures);
  const oldBalance = round2(sum(figs.map((f) => f.balance)));
  const rebate = round2(sum(figs.map((f) => f.rebate)));
  const payoff = round2(oldBalance - rebate);
  const freed = round2(sum(figs.map((f) => f.amort)));

  const nthpAfter = round2(app.nthp + freed - amort);
  const capacity = Math.max(0, app.nthp + freed - RULES.nthpFloor);
  const maxLoanable = Math.min(
    RULES.maxAmount,
    Math.floor((capacity * app.term) / (1 + rate * app.term) / 100) * 100,
  );
  const net = round2(amount - serviceFee - processingFee - docStamp - payoff);

  const errors: string[] = [];
  if (!app.borrower.name.trim()) errors.push('Borrower name is required (Borrower tab).');
  if (amount < RULES.minAmount) errors.push(`Loan amount must be at least ${peso(RULES.minAmount)}.`);
  if (amount > RULES.maxAmount) errors.push(`Loan amount can't exceed ${peso(RULES.maxAmount)}.`);
  if (nthpAfter < RULES.nthpFloor) {
    errors.push(
      `Take-home pay after deduction would be ${peso(nthpAfter)}, below the ${peso(RULES.nthpFloor)} floor. ` +
        `Max loanable at ${app.term} months is ${peso(maxLoanable)}.`,
    );
  }
  if (app.type === 'reloan') {
    if (selected.length === 0) errors.push('Re-loan: select at least one existing loan to pay off.');
    selected.forEach((l, i) => {
      if (!figs[i].eligible) {
        errors.push(
          `Loan ${l.account} has ${l.paid}/${l.term} installments paid; re-loan needs ${RULES.reloanPaidRatio * 100}% of the term paid.`,
        );
      }
    });
  }
  if (amount > 0 && net <= 0) errors.push('Net proceeds must be positive.');

  return { rate, interest, amort, serviceFee, processingFee, docStamp, oldBalance, rebate, payoff, freed, nthpAfter, maxLoanable, net, errors };
}

function schedule(app: Application) {
  const c = compute(app);
  const principal = app.amount / app.term;
  const interest = c.interest / app.term;
  const now = new Date();
  let balance = round2(app.amount + c.interest);
  return Array.from({ length: app.term }, (_, i) => {
    // The last installment absorbs rounding so the loan closes at exactly zero
    const amort = i === app.term - 1 ? balance : c.amort;
    balance = round2(balance - amort);
    // Due every month on the last day, starting next month
    const due = new Date(now.getFullYear(), now.getMonth() + i + 2, 0);
    return { no: i + 1, due, principal, interest, amort, balance };
  });
}

/* ============================================================
 * Formatting & helpers
 * ============================================================ */

const money = new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const peso = (n: number) => `₱${money.format(n)}`;
const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

/* ============================================================
 * Seed data (all fictional)
 * ============================================================ */

const blankBorrower = (): Borrower => ({
  name: '',
  employeeId: '',
  position: '',
  agency: '',
  employedSince: '',
  mobile: '',
  coName: '',
  coRelation: '',
});

function seed(): Application[] {
  return [
    {
      id: 'LN-2026-0418',
      status: 'pending',
      type: 'reloan',
      term: 36,
      amount: 120_000,
      nthp: 18_250,
      borrower: {
        name: 'Andrea Villanueva',
        employeeId: 'EMP-20931',
        position: 'Teacher III',
        agency: 'Schools Division Office (demo)',
        employedSince: '2014-06-16',
        mobile: '0900 000 0418',
        coName: 'Marco Villanueva',
        coRelation: 'Spouse',
      },
      existing: [
        { account: '2000-1873-0021', released: '2024-08-15', amount: 100_000, term: 36, paid: 20 },
        { account: '2000-1990-0457', released: '2026-02-27', amount: 30_000, term: 12, paid: 2 },
      ],
      payoff: ['2000-1873-0021'],
      history: [
        { at: '2026-10-08T09:12:00', by: 'j.reyes', action: 'Created application' },
        { at: '2026-10-08T09:40:00', by: 'j.reyes', action: 'Submitted for approval' },
      ],
    },
    {
      id: 'LN-2026-0421',
      status: 'draft',
      type: 'new',
      term: 24,
      amount: 50_000,
      nthp: 9_800,
      borrower: {
        name: 'Ramon dela Cruz',
        employeeId: 'EMP-31877',
        position: 'Administrative Aide IV',
        agency: 'City Hall (demo)',
        employedSince: '2019-01-07',
        mobile: '0900 000 0421',
        coName: '',
        coRelation: '',
      },
      existing: [],
      payoff: [],
      history: [{ at: '2026-10-09T14:03:00', by: 'j.reyes', action: 'Created application' }],
    },
    {
      id: 'LN-2026-0415',
      status: 'returned',
      type: 'new',
      term: 36,
      amount: 150_000,
      nthp: 9_200,
      borrower: {
        name: 'Joel Paredes',
        employeeId: 'EMP-27410',
        position: 'Nurse II',
        agency: 'Provincial Hospital (demo)',
        employedSince: '2017-03-01',
        mobile: '0900 000 0415',
        coName: 'Ana Paredes',
        coRelation: 'Parent',
      },
      existing: [],
      payoff: [],
      history: [
        { at: '2026-10-06T10:20:00', by: 'j.reyes', action: 'Created application' },
        { at: '2026-10-06T10:55:00', by: 'j.reyes', action: 'Submitted for approval' },
        {
          at: '2026-10-07T08:31:00',
          by: 'a.lim',
          action: 'Returned to maker',
          remarks: 'Take-home pay after deduction falls below the floor. Lower the amount or extend the term.',
        },
      ],
    },
    {
      id: 'LN-2026-0409',
      status: 'approved',
      type: 'reloan',
      term: 48,
      amount: 200_000,
      nthp: 26_500,
      borrower: {
        name: 'Liza Manalo',
        employeeId: 'EMP-11502',
        position: 'Master Teacher I',
        agency: 'Schools Division Office (demo)',
        employedSince: '2009-06-01',
        mobile: '0900 000 0409',
        coName: 'Paolo Manalo',
        coRelation: 'Spouse',
      },
      existing: [{ account: '2000-1650-0112', released: '2023-11-30', amount: 150_000, term: 48, paid: 34 }],
      payoff: ['2000-1650-0112'],
      history: [
        { at: '2026-10-02T13:15:00', by: 'j.reyes', action: 'Created application' },
        { at: '2026-10-02T13:48:00', by: 'j.reyes', action: 'Submitted for approval' },
        { at: '2026-10-03T09:02:00', by: 'a.lim', action: 'Approved' },
      ],
    },
  ];
}

/* ============================================================
 * State
 * ============================================================ */

const STORAGE_KEY = 'lendline-los-demo-v1';

interface State {
  apps: Application[];
  selectedId: string;
  role: Role;
  tab: Tab;
  returning: boolean;
}

function load(): Pick<State, 'apps' | 'role'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Pick<State, 'apps' | 'role'>;
      if (Array.isArray(saved.apps) && saved.apps.length) return saved;
    }
  } catch {
    /* fall through to seed */
  }
  return { apps: seed(), role: 'maker' };
}

const initial = load();
const state: State = {
  apps: initial.apps,
  role: initial.role,
  selectedId: initial.apps[0].id,
  tab: 'loan',
  returning: false,
};

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apps: state.apps, role: state.role }));
  } catch {
    /* storage unavailable: demo still works for this visit */
  }
}

const current = () => state.apps.find((a) => a.id === state.selectedId) ?? state.apps[0];
const editable = (app: Application) => state.role === 'maker' && (app.status === 'draft' || app.status === 'returned');

function log(app: Application, action: string, remarks?: string) {
  app.history.push({ at: new Date().toISOString(), by: USERS[state.role], action, remarks });
}

/* ============================================================
 * Rendering
 * ============================================================ */

const badge = (s: Status) => `<span class="badge badge-${s}">${STATUS_LABEL[s]}</span>`;

function renderTopbar() {
  document.querySelectorAll<HTMLButtonElement>('[data-role]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.role === state.role));
  });
  $('#user').innerHTML = `<span class="avatar" aria-hidden="true">${USERS[state.role][0].toUpperCase()}</span>${USERS[state.role]} · <span class="muted">${state.role === 'maker' ? 'Maker' : 'Checker'}</span>`;
  $<HTMLButtonElement>('#new-btn').hidden = state.role !== 'maker';
}

function renderQueue() {
  const order: Record<Status, number> =
    state.role === 'checker'
      ? { pending: 0, returned: 1, draft: 2, approved: 3 }
      : { returned: 0, draft: 1, pending: 2, approved: 3 };
  const apps = [...state.apps].sort((a, b) => order[a.status] - order[b.status] || b.id.localeCompare(a.id));

  $('#queue').innerHTML = apps
    .map(
      (a) => `
      <li>
        <button type="button" class="queue-item" data-select="${esc(a.id)}" aria-current="${a.id === state.selectedId}">
          <span class="queue-row"><span class="mono">${esc(a.id)}</span>${badge(a.status)}</span>
          <span class="queue-name">${esc(a.borrower.name || 'New applicant')}</span>
          <span class="queue-row muted"><span>${a.type === 'reloan' ? 'Re-loan' : 'New'} · ${a.term} mo</span><span class="num">${peso(a.amount || 0)}</span></span>
        </button>
      </li>`,
    )
    .join('');
}

function field(label: string, name: string, value: string | number, opts: { type?: string; disabled: boolean; hint?: string }) {
  return `
    <label class="field">
      <span class="field-label">${label}</span>
      <input name="${name}" data-field="${name}" type="${opts.type ?? 'text'}" value="${esc(value)}" ${opts.disabled ? 'disabled' : ''} ${opts.type === 'number' ? 'inputmode="decimal" min="0" step="1000"' : ''} />
      ${opts.hint ? `<span class="field-hint">${opts.hint}</span>` : ''}
    </label>`;
}

function select(label: string, name: string, value: string | number, options: [string | number, string][], disabled: boolean) {
  return `
    <label class="field">
      <span class="field-label">${label}</span>
      <select name="${name}" data-field="${name}" ${disabled ? 'disabled' : ''}>
        ${options.map(([v, l]) => `<option value="${v}" ${String(v) === String(value) ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </label>`;
}

function renderComputed(app: Application) {
  const c = compute(app);
  const row = (label: string, value: string, cls = '') => `<div class="calc-row ${cls}"><dt>${label}</dt><dd class="num">${value}</dd></div>`;
  return `
    <dl class="calc">
      ${row('Add-on rate', `${(c.rate * 100).toFixed(2)}% / mo`)}
      ${row('Total interest', peso(c.interest))}
      ${row('Monthly amortization', peso(c.amort), 'calc-strong')}
      <div class="calc-sep"></div>
      ${row('Service fee (1%)', peso(c.serviceFee))}
      ${row('Processing fee (2%)', peso(c.processingFee))}
      ${row('Documentary stamp', peso(c.docStamp))}
      ${
        app.type === 'reloan'
          ? `${row('Old balance', peso(c.oldBalance))}
             ${row('Less: rebate (Rule of 78)', `−${peso(c.rebate)}`)}
             ${row('Payoff of old loans', peso(c.payoff))}`
          : ''
      }
      <div class="calc-sep"></div>
      ${row('Net proceeds', peso(c.net), 'calc-total')}
      <div class="calc-sep"></div>
      ${row('Take-home pay after', peso(c.nthpAfter), c.nthpAfter < RULES.nthpFloor ? 'calc-bad' : 'calc-good')}
      ${row('Max loanable', peso(c.maxLoanable))}
    </dl>`;
}

function renderErrors(app: Application) {
  const { errors } = compute(app);
  if (!errors.length) {
    return `<p class="check-ok">✓ Passes all checks</p>`;
  }
  return `<ul class="check-list">${errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`;
}

function renderLoanTab(app: Application) {
  const ro = !editable(app);
  const loansDisabled = ro || app.type !== 'reloan';
  return `
    <div class="loan-grid">
      <section class="panel">
        <h3>Application</h3>
        ${select('Loan type', 'type', app.type, [['new', 'New loan'], ['reloan', 'Re-loan']], ro)}
        ${select('Term', 'term', app.term, TERMS.map((t) => [t, `${t} months`]), ro)}
        ${field('Loan amount', 'amount', app.amount, { type: 'number', disabled: ro, hint: `${peso(RULES.minAmount)} to ${peso(RULES.maxAmount)}` })}
        ${field('Monthly take-home pay (NTHP)', 'nthp', app.nthp, { type: 'number', disabled: ro, hint: 'After all current deductions' })}
      </section>

      <section class="panel panel-wide">
        <h3>Existing loans</h3>
        ${
          app.existing.length
            ? `<div class="table-wrap"><table class="table">
                <thead><tr><th scope="col"><span class="sr-only">Pay off</span></th><th scope="col">Account</th><th scope="col">Released</th><th scope="col" class="num">Amount</th><th scope="col" class="num">Paid</th><th scope="col" class="num">Balance</th><th scope="col" class="num">Payoff</th></tr></thead>
                <tbody>
                ${app.existing
                  .map((l) => {
                    const f = existingFigures(l);
                    return `<tr class="${f.eligible ? '' : 'row-muted'}">
                      <td><input type="checkbox" data-payoff="${esc(l.account)}" aria-label="Pay off ${esc(l.account)}" ${app.payoff.includes(l.account) ? 'checked' : ''} ${loansDisabled ? 'disabled' : ''} /></td>
                      <td class="mono">${esc(l.account)}</td>
                      <td>${fmtDate(l.released)}</td>
                      <td class="num">${money.format(l.amount)}</td>
                      <td class="num">${l.paid}/${l.term}${f.eligible ? '' : ' <span class="tag">Not eligible</span>'}</td>
                      <td class="num">${money.format(f.balance)}</td>
                      <td class="num">${money.format(f.payoff)}</td>
                    </tr>`;
                  })
                  .join('')}
                </tbody></table></div>
                <p class="note">${app.type === 'reloan' ? 'Tick the loans to pay off from the new proceeds. Unearned interest is rebated using the Rule of 78.' : 'Switch the loan type to <strong>Re-loan</strong> to pay these off.'}</p>`
            : `<p class="empty">No existing loans on record.</p>`
        }
        <h3 class="mt">Checks</h3>
        <div id="errors">${renderErrors(app)}</div>
      </section>

      <section class="panel">
        <h3>Computation</h3>
        <div id="computed">${renderComputed(app)}</div>
      </section>
    </div>`;
}

function renderBorrowerTab(app: Application) {
  const ro = !editable(app);
  const b = app.borrower;
  return `
    <div class="form-grid">
      <section class="panel">
        <h3>Borrower</h3>
        ${field('Full name', 'borrower.name', b.name, { disabled: ro })}
        ${field('Employee ID', 'borrower.employeeId', b.employeeId, { disabled: ro })}
        ${field('Position', 'borrower.position', b.position, { disabled: ro })}
        ${field('Agency / employer', 'borrower.agency', b.agency, { disabled: ro })}
        ${field('Employed since', 'borrower.employedSince', b.employedSince, { type: 'date', disabled: ro })}
        ${field('Mobile', 'borrower.mobile', b.mobile, { disabled: ro })}
      </section>
      <section class="panel">
        <h3>Co-obligor</h3>
        ${field('Full name', 'borrower.coName', b.coName, { disabled: ro })}
        ${select('Relationship', 'borrower.coRelation', b.coRelation, [['', '—'], ['Spouse', 'Spouse'], ['Parent', 'Parent'], ['Sibling', 'Sibling'], ['Other', 'Other']], ro)}
      </section>
    </div>`;
}

function renderScheduleTab(app: Application) {
  const rows = schedule(app);
  return `
    <section class="panel">
      <h3>Amortization schedule <span class="muted">· monthly, every last day of the month</span></h3>
      <div class="table-wrap table-scroll"><table class="table">
        <thead><tr><th scope="col">#</th><th scope="col">Due date</th><th scope="col" class="num">Principal</th><th scope="col" class="num">Interest</th><th scope="col" class="num">Amortization</th><th scope="col" class="num">Balance</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `<tr><td>${r.no}</td><td>${fmtDate(r.due)}</td><td class="num">${money.format(r.principal)}</td><td class="num">${money.format(r.interest)}</td><td class="num">${money.format(r.amort)}</td><td class="num">${money.format(r.balance)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table></div>
    </section>`;
}

function renderHistoryTab(app: Application) {
  return `
    <section class="panel">
      <h3>Audit trail</h3>
      <ol class="timeline">
        ${[...app.history]
          .reverse()
          .map(
            (h) => `<li>
              <span class="timeline-dot" aria-hidden="true"></span>
              <div>
                <p><strong>${esc(h.action)}</strong> <span class="muted">by ${esc(h.by)}</span></p>
                <p class="muted small">${fmtDateTime(h.at)}</p>
                ${h.remarks ? `<p class="remark">“${esc(h.remarks)}”</p>` : ''}
              </div>
            </li>`,
          )
          .join('')}
      </ol>
    </section>`;
}

function renderActions(app: Application) {
  const { errors } = compute(app);
  const ok = errors.length === 0;

  if (state.role === 'maker') {
    if (!editable(app)) {
      return `<p class="muted">${app.status === 'pending' ? 'Waiting for a checker. Switch to <strong>Checker</strong> above to review it.' : 'This application is closed.'}</p>`;
    }
    return `
      <p class="muted">${ok ? 'Ready to submit.' : `${errors.length} issue${errors.length > 1 ? 's' : ''} to fix before submitting.`}</p>
      <div class="actions-btns">
        <button type="button" class="btn" data-action="save">Save draft</button>
        <button type="button" class="btn btn-primary" data-action="submit" ${ok ? '' : 'disabled'}>Submit for approval</button>
      </div>`;
  }

  if (app.status !== 'pending') {
    return `<p class="muted">${app.status === 'approved' ? 'Approved. Nothing left to review.' : 'Not submitted yet. Only applications that are <strong>For approval</strong> can be reviewed.'}</p>`;
  }
  if (state.returning) {
    return `
      <label class="field grow">
        <span class="field-label">Reason for returning</span>
        <input id="return-remarks" type="text" placeholder="Tell the maker what to fix" />
      </label>
      <div class="actions-btns">
        <button type="button" class="btn" data-action="cancel-return">Cancel</button>
        <button type="button" class="btn btn-danger" data-action="confirm-return">Return to maker</button>
      </div>`;
  }
  return `
    <p class="muted">${ok ? 'All checks pass.' : 'This application fails checks and can’t be approved.'}</p>
    <div class="actions-btns">
      <button type="button" class="btn" data-action="return">Return</button>
      <button type="button" class="btn btn-primary" data-action="approve" ${ok ? '' : 'disabled'}>Approve</button>
    </div>`;
}

function renderDetail() {
  const app = current();
  const c = compute(app);
  const lastReturn = [...app.history].reverse().find((h) => h.action === 'Returned to maker');
  const tabs: [Tab, string][] = [
    ['loan', 'Loan info'],
    ['borrower', 'Borrower'],
    ['schedule', 'Schedule'],
    ['history', 'History'],
  ];
  const body = {
    loan: renderLoanTab,
    borrower: renderBorrowerTab,
    schedule: renderScheduleTab,
    history: renderHistoryTab,
  }[state.tab](app);

  $('#detail').innerHTML = `
    <div class="detail-head">
      <div>
        <p class="mono muted">${esc(app.id)} · ${app.type === 'reloan' ? 'Re-loan' : 'New loan'}</p>
        <h1>${esc(app.borrower.name || 'New applicant')}</h1>
        <p class="muted">${esc([app.borrower.position, app.borrower.agency].filter(Boolean).join(' · ') || 'No employment details yet')}</p>
      </div>
      <div class="head-figures">
        ${badge(app.status)}
        <div><span class="muted small">Amount</span><strong class="num">${peso(app.amount || 0)}</strong></div>
        <div><span class="muted small">Monthly</span><strong class="num" id="head-amort">${peso(c.amort)}</strong></div>
      </div>
    </div>

    ${
      app.status === 'returned' && lastReturn?.remarks
        ? `<div class="callout"><strong>Returned by ${esc(lastReturn.by)}:</strong> ${esc(lastReturn.remarks)}</div>`
        : ''
    }

    <div class="tabs" role="tablist">
      ${tabs.map(([id, label]) => `<button type="button" role="tab" data-tab="${id}" aria-selected="${state.tab === id}">${label}</button>`).join('')}
    </div>

    <div class="tab-body" role="tabpanel">${body}</div>

    <div class="actions" id="actions">${renderActions(app)}</div>`;
}

/** Cheap refresh while typing: update numbers without re-rendering the inputs (keeps focus) */
function refreshFigures() {
  const app = current();
  const computed = document.getElementById('computed');
  if (computed) computed.innerHTML = renderComputed(app);
  const errs = document.getElementById('errors');
  if (errs) errs.innerHTML = renderErrors(app);
  const amort = document.getElementById('head-amort');
  if (amort) amort.textContent = peso(compute(app).amort);
  $('#actions').innerHTML = renderActions(app);
}

function render() {
  renderTopbar();
  renderQueue();
  renderDetail();
}

let toastTimer = 0;
function toast(msg: string) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2200);
}

/* ============================================================
 * Events
 * ============================================================ */

function setField(app: Application, name: string, raw: string) {
  if (name.startsWith('borrower.')) {
    const key = name.slice('borrower.'.length) as keyof Borrower;
    app.borrower[key] = raw;
  } else if (name === 'type') {
    app.type = raw as LoanType;
    if (app.type === 'new') app.payoff = [];
  } else if (name === 'term' || name === 'amount' || name === 'nthp') {
    app[name] = raw === '' ? 0 : Number(raw);
  }
}

document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-action],[data-select],[data-tab],[data-role]');
  if (!t) return;
  const app = current();

  if (t.dataset.select) {
    state.selectedId = t.dataset.select;
    state.returning = false;
    render();
    return;
  }
  if (t.dataset.tab) {
    state.tab = t.dataset.tab as Tab;
    renderDetail();
    return;
  }
  if (t.dataset.role) {
    state.role = t.dataset.role as Role;
    state.returning = false;
    persist();
    render();
    return;
  }

  switch (t.dataset.action) {
    case 'new': {
      const next = Math.max(...state.apps.map((a) => Number(a.id.split('-').pop()))) + 1;
      const app: Application = {
        id: `LN-2026-${String(next).padStart(4, '0')}`,
        status: 'draft',
        type: 'new',
        term: 36,
        amount: 50_000,
        nthp: 15_000,
        borrower: blankBorrower(),
        existing: [],
        payoff: [],
        history: [],
      };
      log(app, 'Created application');
      state.apps.push(app);
      state.selectedId = app.id;
      state.tab = 'borrower';
      persist();
      render();
      document.querySelector<HTMLInputElement>('[data-field="borrower.name"]')?.focus();
      break;
    }
    case 'save':
      log(app, 'Saved draft');
      persist();
      toast('Draft saved');
      renderQueue();
      break;
    case 'submit':
      if (compute(app).errors.length) return;
      app.status = 'pending';
      log(app, 'Submitted for approval');
      persist();
      toast(`${app.id} submitted for approval`);
      render();
      break;
    case 'approve':
      if (compute(app).errors.length) return;
      app.status = 'approved';
      log(app, 'Approved');
      persist();
      toast(`${app.id} approved`);
      render();
      break;
    case 'return':
      state.returning = true;
      $('#actions').innerHTML = renderActions(app);
      document.getElementById('return-remarks')?.focus();
      break;
    case 'cancel-return':
      state.returning = false;
      $('#actions').innerHTML = renderActions(app);
      break;
    case 'confirm-return': {
      const input = document.getElementById('return-remarks') as HTMLInputElement | null;
      const remarks = input?.value.trim() ?? '';
      if (!remarks) {
        input?.focus();
        input?.setAttribute('aria-invalid', 'true');
        return;
      }
      app.status = 'returned';
      log(app, 'Returned to maker', remarks);
      state.returning = false;
      persist();
      toast(`${app.id} returned to maker`);
      render();
      break;
    }
    case 'reset':
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      state.apps = seed();
      state.role = 'maker';
      state.selectedId = state.apps[0].id;
      state.tab = 'loan';
      state.returning = false;
      render();
      toast('Demo reset');
      break;
  }
});

document.addEventListener('input', (e) => {
  const el = e.target as HTMLInputElement;
  if (!el.dataset.field || el.tagName !== 'INPUT') return;
  const app = current();
  setField(app, el.dataset.field, el.value);
  persist();
  if (el.dataset.field === 'borrower.name') renderQueue();
  refreshFigures();
});

document.addEventListener('change', (e) => {
  const el = e.target as HTMLInputElement | HTMLSelectElement;
  const app = current();
  if (el instanceof HTMLSelectElement && el.dataset.field) {
    setField(app, el.dataset.field, el.value);
    persist();
    renderQueue();
    renderDetail();
  } else if (el instanceof HTMLInputElement && el.dataset.payoff) {
    const acct = el.dataset.payoff;
    app.payoff = el.checked ? [...app.payoff, acct] : app.payoff.filter((a) => a !== acct);
    persist();
    refreshFigures();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.target as HTMLElement).id === 'return-remarks') {
    document.querySelector<HTMLButtonElement>('[data-action="confirm-return"]')?.click();
  }
});

render();
