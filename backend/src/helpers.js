export const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const toInt = (v, fallback = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

export const toBool = (v, fallback = false) => {
  if (v === undefined || v === null || v === '') return fallback;
  if (typeof v === 'boolean') return v;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
};

export function slugify(input = '') {
  const base = String(input)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || `item-${Date.now().toString(36)}`;
}

export function uniqueSlug(base) {
  return `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function isEmail(v = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));
}

/** converts "12,000" / "۱۲۰۰۰" into a number */
export function parseMoney(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const normalized = String(value)
    .replace(/[۰-۹]/g, (d) => fa.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^\d-]/g, '');
  const n = parseInt(normalized, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function jsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function orderCode() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `SENZ-${digits}`;
}

export function publicSettings(rows) {
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}
