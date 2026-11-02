const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFa(value) {
  return String(value ?? '').replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatNumber(value) {
  const n = Number(value || 0);
  return toFa(n.toLocaleString('en-US'));
}

export function formatPrice(value) {
  return `${formatNumber(value)} تومان`;
}

export function discountPercent(price, comparePrice) {
  const p = Number(price || 0);
  const c = Number(comparePrice || 0);
  if (!c || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

function div(a, b) {
  return Math.floor(a / b);
}

/** Gregorian → Jalali (deterministic, no Intl dependency). */
export function toJalali(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return { year: 0, month: 0, day: 0 };
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  gDaysInMonth[1] = isLeap ? 29 : 28;

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    gDaysInMonth.slice(0, gm - 1).reduce((a, b) => a + b, 0);

  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { year: jy, month: jm, day: jd };
}

export function formatDate(dateInput, { withTime = false } = {}) {
  if (!dateInput) return '';
  const { year, month, day } = toJalali(dateInput);
  if (!year) return '';
  const date = new Date(dateInput);
  const base = `${toFa(day)} ${JALALI_MONTHS[month - 1]} ${toFa(year)}`;
  if (!withTime) return base;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${base} - ${toFa(hh)}:${toFa(mm)}`;
}

export function shortDate(dateInput) {
  if (!dateInput) return '';
  const { year, month, day } = toJalali(dateInput);
  return toFa(`${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`);
}

export function readingTime(text = '') {
  const words = String(text).trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
