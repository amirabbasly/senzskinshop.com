/**
 * اسلاگ‌های فارسی/یونیکد در Next.js گاهی به‌صورت percent-encoded به
 * `params` می‌رسند. این هلپر ورودی را یک یا دو بار دیکد می‌کند تا لینک‌ها
 * و درخواست‌های API همیشه با مقدار خام (مثل «شامپو-۱۳۲-…») کار کنند.
 */
export function decodeSlug(value = '') {
  let out = String(value ?? '');
  for (let i = 0; i < 2; i += 1) {
    if (!out.includes('%')) break;
    try {
      const next = decodeURIComponent(out);
      if (next === out) break;
      out = next;
    } catch {
      break;
    }
  }
  return out;
}

export function encodeSlug(value = '') {
  return encodeURIComponent(decodeSlug(value));
}

export const productHref = (slug) => `/products/${encodeSlug(slug)}`;
export const categoryHref = (slug) => `/category/${encodeSlug(slug)}`;
export const postHref = (slug) => `/blog/${encodeSlug(slug)}`;
