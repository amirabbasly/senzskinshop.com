'use client';

import { useState } from 'react';
import { CLIENT_API } from '@/lib/api';
import { Star } from '../Icons';

export default function ReviewForm({ slug }) {
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 });
  const [state, setState] = useState({ loading: false, message: '', error: false });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, message: '', error: false });
    try {
      const res = await fetch(`${CLIENT_API}/products/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ثبت نظر انجام نشد.');
      setState({ loading: false, message: data.message, error: false });
      setForm({ name: '', comment: '', rating: 5 });
    } catch (err) {
      setState({ loading: false, message: err.message, error: true });
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-cream-300 bg-cream-50 p-5">
      <h3 className="text-sm font-extrabold text-brand-950">ثبت نظر شما</h3>
      <p className="mt-1 text-[11px] text-ink/50">نظر شما پس از تأیید کارشناسان نمایش داده می‌شود.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">نام و نام خانوادگی</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثلاً سارا محمدی"
          />
        </div>
        <div>
          <label className="label">امتیاز شما</label>
          <div className="flex items-center gap-1 rounded-xl border border-cream-300 bg-white px-3 py-2.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, rating: value })}
                aria-label={`${value} ستاره`}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 ${value <= form.rating ? 'text-gold-400' : 'text-cream-300'}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="label">متن نظر</label>
        <textarea
          className="input min-h-24"
          required
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="تجربه‌تان از استفاده از این محصول را بنویسید…"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={state.loading} className="btn-primary btn-sm">
          {state.loading ? 'در حال ارسال…' : 'ارسال نظر'}
        </button>
        {state.message && (
          <span className={`text-[11px] ${state.error ? 'text-rose-600' : 'text-emerald-600'}`}>{state.message}</span>
        )}
      </div>
    </form>
  );
}
