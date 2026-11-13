'use client';

const TOKEN_KEY = 'senz_admin_token';
const USER_KEY = 'senz_admin_user';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getAdmin() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(token, admin) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(admin || null));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function adminApi(path, { method = 'GET', body, form } = {}) {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(form ? {} : { 'Content-Type': 'application/json' }),
    },
    body: form ? body : body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 401) {
    clearSession();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('نشست شما منقضی شده است.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'خطا در ارتباط با سرور.');
  return data;
}

export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('files', file);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'بارگذاری تصویر انجام نشد.');
  return data.files || [];
}

export async function uploadImages(files) {
  const token = getToken();
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('files', file));
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'بارگذاری تصویر انجام نشد.');
  return data.files || [];
}

export function formatApiError(err) {
  return err?.message || 'خطای نامشخص';
}
