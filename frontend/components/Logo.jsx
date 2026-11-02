export function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="SENZ SKIN SHOP">
      <defs>
        <linearGradient id="senzEmblem" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2b6e58" />
          <stop offset="1" stopColor="#14332a" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="15" fill="url(#senzEmblem)" />
      <circle cx="24" cy="24" r="18.4" fill="none" stroke="#c9a227" strokeOpacity=".55" strokeWidth="1" />
      <path
        d="M24 10.5c5.6 6.4 8.9 10.6 8.9 14.6a8.9 8.9 0 1 1-17.8 0c0-4 3.3-8.2 8.9-14.6Z"
        fill="#fdf9ed"
        fillOpacity=".96"
      />
      <path
        d="M24 16.4c3.6 2.9 5.2 5.5 4.6 8.6-.5 2.7-2.6 4.8-5.4 5.4-1 .2-1.9.1-2.8-.2 2.7-.9 4.5-3 4.9-5.9.3-2.4-.2-4.9-1.3-7.9Z"
        fill="#c9a227"
      />
      <path d="M15 37.5h18" stroke="#c9a227" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ settings = {}, light = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-11 w-11 shrink-0 drop-shadow-sm" />
      <div className="leading-tight">
        <div
          className={`text-lg font-black tracking-[0.28em] ${light ? 'text-cream-50' : 'text-brand-950'}`}
          dir="ltr"
        >
          SENZ
        </div>
        <div
          className={`mt-0.5 text-[9px] font-bold tracking-[0.34em] ${
            light ? 'text-gold-300' : 'text-gold-600'
          }`}
          dir="ltr"
        >
          SKIN SHOP
        </div>
        <span className="sr-only">{settings.site_name || 'سنز اسکین شاپ'}</span>
      </div>
    </div>
  );
}
