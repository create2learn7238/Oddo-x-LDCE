const DAY = 86400000;

export function atUTC(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((atUTC(b).getTime() - atUTC(a).getTime()) / DAY);
}

export function addDays(date: Date, n: number): Date {
  const d = atUTC(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

/** Local-timezone date -> YYYY-MM-DD */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function fmtDate(date: Date): string {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function fmtDateShort(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function fmtDateFull(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function fmtRange(a: Date, b: Date): string {
  return `${fmtDateShort(a)} – ${fmtDateShort(b)} ${b.getFullYear()}`;
}

export function monthLabel(date: Date): string {
  return `${['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]} ${date.getFullYear()}`;
}

export function fmtMoney(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
