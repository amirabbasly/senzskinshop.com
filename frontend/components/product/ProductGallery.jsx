'use client';

import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Heart } from '../Icons';

export default function ProductGallery({ images = [], name = '' }) {
  const list = images.length ? images : [PLACEHOLDER_IMAGE];
  const [active, setActive] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-cream-300/80 bg-white">
        <div className="aspect-square">
          <img src={list[active]} alt={name} className="h-full w-full object-cover" />
        </div>
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label="افزودن به علاقه‌مندی‌ها"
          className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition ${
            liked
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-cream-300 bg-white/80 text-ink/50 hover:text-rose-500'
          }`}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                active === index ? 'border-brand-700' : 'border-cream-300 hover:border-brand-300'
              }`}
            >
              <img src={image} alt={`${name} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
