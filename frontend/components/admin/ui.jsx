'use client';

import { useRef, useState } from 'react';
import { uploadImages } from '@/lib/adminApi';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Check, ImageIcon, Plus, Trash, Upload, X } from '../Icons';

export function PageHeader({ title, desc, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-black text-brand-950">{title}</h2>
        {desc && <p className="mt-1 text-[11px] text-ink/50">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`admin-card ${className}`}>{children}</div>;
}

export function Field({ label, children, hint, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="admin-label">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-[10px] text-ink/40">{hint}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return <input className={`admin-input ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`admin-input min-h-28 ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`admin-input ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-300 bg-cream-50/60 px-3.5 py-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-brand-700' : 'bg-cream-400'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? 'right-0.5' : 'right-[1.125rem]'
          }`}
        />
      </button>
      <span>
        <span className="block text-[11.5px] font-bold text-brand-950">{label}</span>
        {description && <span className="mt-0.5 block text-[10px] leading-4 text-ink/45">{description}</span>}
      </span>
    </label>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  const styles =
    type === 'success'
      ? 'bg-brand-50 text-brand-700 border-brand-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';
  return <div className={`rounded-xl border px-3.5 py-2.5 text-[11.5px] ${styles}`}>{children}</div>;
}

export function Modal({ open, onClose, title, children, width = 'max-w-2xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-brand-950/50 p-4 py-10">
      <div className={`w-full ${width} rounded-2xl bg-white shadow-card`}>
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-3.5">
          <h3 className="text-sm font-extrabold text-brand-950">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink/40 hover:bg-cream-100" aria-label="بستن">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Thumb({ src, alt = '', size = 'h-11 w-11' }) {
  return (
    <span className={`block ${size} shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100`}>
      <img src={src || PLACEHOLDER_IMAGE} alt={alt} className="h-full w-full object-cover" />
    </span>
  );
}

export function Empty({ title = 'موردی یافت نشد', desc, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-400 bg-cream-50/50 p-10 text-center">
      <ImageIcon className="mx-auto h-7 w-7 text-brand-400" />
      <p className="mt-3 text-xs font-bold text-brand-950">{title}</p>
      {desc && <p className="mt-1 text-[11px] text-ink/45">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'در حال بارگذاری…' }) {
  return <div className="py-10 text-center text-xs text-ink/40">{label}</div>;
}

export function ImageUploader({ images = [], onChange, multiple = true }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setError('');
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      onChange(multiple ? [...images, ...urls] : urls.slice(0, 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange(multiple ? [...images, url] : [url]);
    setUrlInput('');
  }

  function removeAt(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-cream-300">
            <img src={image} alt={`تصویر ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute inset-0 flex items-center justify-center bg-brand-950/50 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="حذف تصویر"
            >
              <Trash className="h-4 w-4" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 right-1 rounded bg-brand-900/80 px-1.5 py-0.5 text-[8px] font-bold text-cream-50">
                اصلی
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-cream-400 bg-cream-50 text-[9.5px] font-bold text-ink/45 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          {uploading ? 'در حال آپلود…' : 'بارگذاری تصویر'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />

      <div className="mt-2.5 flex gap-2">
        <input
          className="admin-input py-2 text-[11px]"
          dir="ltr"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="یا آدرس تصویر را وارد کنید: /images/... یا https://..."
        />
        <button type="button" onClick={addUrl} className="admin-btn shrink-0 bg-brand-50 text-brand-800">
          <Plus className="h-3.5 w-3.5" />
          افزودن
        </button>
      </div>
      {error && <p className="mt-2 text-[10px] text-rose-600">{error}</p>}
      <p className="mt-1.5 text-[10px] text-ink/40">فرمت‌های مجاز: JPG، PNG، WebP — حداکثر ۸ مگابایت برای هر تصویر.</p>
    </div>
  );
}

export function SpecsEditor({ specs = [], onChange }) {
  function update(index, key, value) {
    const next = specs.map((spec, i) => (i === index ? { key, value } : spec));
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {specs.map((spec, index) => (
        <div key={index} className="flex gap-2">
          <input
            className="admin-input flex-1"
            value={spec.key || ''}
            onChange={(e) => update(index, e.target.value, spec.value)}
            placeholder="عنوان مشخصه (مثلاً حجم)"
          />
          <input
            className="admin-input flex-1"
            value={spec.value || ''}
            onChange={(e) => update(index, spec.key, e.target.value)}
            placeholder="مقدار (مثلاً ۳۰ میلی‌لیتر)"
          />
          <button
            type="button"
            onClick={() => onChange(specs.filter((_, i) => i !== index))}
            className="admin-btn shrink-0 bg-rose-50 text-rose-600"
            aria-label="حذف مشخصه"
          >
            <Trash className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...specs, { key: '', value: '' }])}
        className="admin-btn bg-cream-100 text-brand-800"
      >
        <Plus className="h-3.5 w-3.5" />
        افزودن مشخصه
      </button>
    </div>
  );
}

export function SaveBar({ loading, message, error, onCancel, submitLabel = 'ذخیره' }) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cream-300 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="min-w-0 text-[11px]">
        {error ? <span className="text-rose-600">{error}</span> : message ? <span className="text-brand-700">{message}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn bg-cream-100 text-ink/60">
            انصراف
          </button>
        )}
        <button type="submit" disabled={loading} className="admin-btn bg-brand-800 px-5 text-cream-50">
          <Check className="h-4 w-4" />
          {loading ? 'در حال ذخیره…' : submitLabel}
        </button>
      </div>
    </div>
  );
}
