'use client';

import { useState } from 'react';
import { formatDate, toFa } from '@/lib/format';
import Stars from './Stars';
import ReviewForm from './ReviewForm';
import { Check, Leaf, Sparkles } from '../Icons';

function Paragraphs({ text, fallback }) {
  const content = (text || '').trim();
  if (!content) return <p className="text-sm text-ink/50">{fallback}</p>;
  return (
    <div className="prose-fa">
      {content.split(/\n{2,}/).map((block, index) => (
        <p key={index}>{block}</p>
      ))}
    </div>
  );
}

export default function ProductTabs({ product, reviews = [] }) {
  const [tab, setTab] = useState('desc');

  const tabs = [
    { key: 'desc', label: 'توضیحات محصول' },
    { key: 'specs', label: 'مشخصات' },
    { key: 'usage', label: 'روش استفاده' },
    { key: 'ingredients', label: 'ترکیبات' },
    { key: 'reviews', label: `نظرات (${toFa(reviews.length)})` },
  ];

  return (
    <div className="rounded-[1.75rem] border border-cream-300/80 bg-white p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-cream-200 pb-3">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              tab === item.key ? 'bg-brand-300 text-brand-950' : 'text-ink/60 hover:bg-cream-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'desc' && (
        <div className="space-y-4">
          <Paragraphs text={product.description} fallback="توضیحاتی برای این محصول ثبت نشده است." />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Check, title: 'اصالت تضمین‌شده', desc: 'ارسال از انبار رسمی SENZ' },
              { icon: Leaf, title: 'مناسب پوست حساس', desc: 'بدون الکل و اسانس قوی' },
              { icon: Sparkles, title: 'تست‌شده در آزمایشگاه', desc: 'کنترل کیفیت هر بچ تولید' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2.5 rounded-2xl bg-cream-100/70 p-3.5">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <div>
                  <p className="text-[11.5px] font-bold text-brand-950">{item.title}</p>
                  <p className="mt-1 text-[10.5px] text-ink/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'specs' && (
        <div className="overflow-hidden rounded-2xl border border-cream-300">
          <table className="w-full text-right text-xs">
            <tbody>
              {[
                { key: 'برند', value: product.brand },
                { key: 'حجم', value: product.volume },
                { key: 'نوع پوست', value: product.skin_type },
                ...(Array.isArray(product.specs) ? product.specs : []),
              ]
                .filter((row) => row.value)
                .map((row, index) => (
                  <tr key={`${row.key}-${index}`} className={index % 2 ? 'bg-cream-50' : 'bg-white'}>
                    <th className="w-40 border-b border-cream-200 px-4 py-3 font-bold text-ink/55">{row.key}</th>
                    <td className="border-b border-cream-200 px-4 py-3 text-brand-950">{row.value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'usage' && <Paragraphs text={product.how_to_use} fallback="روش استفاده ثبت نشده است." />}
      {tab === 'ingredients' && <Paragraphs text={product.ingredients} fallback="ترکیبات ثبت نشده است." />}

      {tab === 'reviews' && (
        <div>
          {reviews.length === 0 ? (
            <p className="rounded-2xl bg-cream-100/70 p-5 text-xs text-ink/55">
              هنوز نظری ثبت نشده است. اولین نظر را شما بنویسید.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-cream-200 bg-cream-50/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-800">
                        {review.name?.trim()?.charAt(0) || 'م'}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-brand-950">{review.name}</p>
                        <p className="mt-0.5 text-[10px] text-ink/40">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <Stars value={review.rating} />
                  </div>
                  <p className="mt-3 text-xs leading-6 text-ink/70">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
          <ReviewForm slug={product.slug} />
        </div>
      )}
    </div>
  );
}
