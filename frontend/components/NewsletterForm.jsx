'use client';

import { useState } from 'react';
import { CLIENT_API } from '@/lib/api';
import { Mail } from './Icons';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ loading: false, message: '', error: false });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, message: '', error: false });
    try {
      const res = await fetch(`${CLIENT_API}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ثبت ایمیل انجام نشد.');
      setState({ loading: false, message: data.message || 'عضویت ثبت شد.', error: false });
      setEmail('');
    } catch (err) {
      setState({ loading: false, message: err.message, error: true });
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/10 px-2 py-1.5">
        <Mail className="mr-2 h-4 w-4 text-brand-600" />
        <input
          type="email"
          required
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل شما"
          className="min-w-0 flex-1 bg-transparent text-xs text-brand-950 outline-none placeholder:text-ink/35"
        />
        <button
          type="submit"
          disabled={state.loading}
          className="rounded-full bg-brand-400 px-4 py-2 text-[11px] font-black text-brand-950 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {state.loading ? '…' : 'عضویت'}
        </button>
      </div>
      {state.message && (
        <p className={`mt-2 text-[11px] ${state.error ? 'text-rose-500' : 'text-brand-700'}`}>{state.message}</p>
      )}
    </form>
  );
}
