export function toQueryString(base = {}, overrides = {}) {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };
  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, Array.isArray(value) ? value[0] : String(value));
  });
  const str = params.toString();
  return str ? `?${str}` : '';
}

export function cleanParams(searchParams = {}) {
  const out = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    const v = Array.isArray(value) ? value[0] : value;
    if (v !== undefined && v !== null && v !== '') out[key] = v;
  });
  return out;
}
