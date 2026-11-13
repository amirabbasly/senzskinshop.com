import { Star } from '../Icons';

export default function Stars({ value = 5, size = 'h-3.5 w-3.5', showValue = false }) {
  const rating = Number(value) || 0;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5 text-gold-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`${size} ${i <= Math.round(rating) ? '' : 'text-cream-300'}`} />
        ))}
      </span>
      {showValue && <span className="text-[11px] font-bold text-brand-900">{rating.toFixed(1)}</span>}
    </span>
  );
}
