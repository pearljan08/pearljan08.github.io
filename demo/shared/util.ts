/* Small helpers shared by the HRIS and AIMS demos. */

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

export const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const money = new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const peso = (n: number) => `₱${money.format(n)}`;

/* ---------- Dates as local "YYYY-MM-DD" strings ---------- */

export const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const TODAY = iso(new Date());

export function fmtDate(s: string, withYear = true) {
  return parse(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}) });
}
export const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/* ---------- Toast ---------- */

let toastTimer = 0;
export function toast(msg: string) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2400);
}

/* ---------- Saved state ---------- */

export function loadSaved<T>(key: string, valid: (v: T) => boolean): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const saved = JSON.parse(raw) as T;
      if (valid(saved)) return saved;
    }
  } catch {
    /* fall through to seed */
  }
  return null;
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: demo still works for this visit */
  }
}

export function clearSaved(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ---------- Form fields ---------- */

export function field(label: string, name: string, value: string | number, opts: { type?: string; hint?: string; attrs?: string } = {}) {
  return `
    <label class="field">
      <span class="field-label">${label}</span>
      <input data-field="${name}" type="${opts.type ?? 'text'}" value="${esc(value)}" ${opts.attrs ?? ''} />
      ${opts.hint ? `<span class="field-hint">${opts.hint}</span>` : ''}
    </label>`;
}

export function select(label: string, name: string, value: string, options: [string, string][]) {
  return `
    <label class="field">
      <span class="field-label">${label}</span>
      <select data-field="${name}">
        ${options.map(([v, l]) => `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(l)}</option>`).join('')}
      </select>
    </label>`;
}

export const checks = (errors: string[], ok = 'Ready to submit') =>
  errors.length ? `<ul class="check-list">${errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : `<p class="check-ok">✓ ${ok}</p>`;

export const kpi = (label: string, value: string, note = '') =>
  `<div class="kpi"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ''}</div>`;
