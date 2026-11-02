export function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <img
      src="/images/logo-senz.png"
      alt="SENZ — Skin & Hair"
      width={512}
      height={512}
      className={`${className} shrink-0 rounded-full object-cover`}
    />
  );
}

export default function Logo({ settings = {}, light = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-11 w-11 drop-shadow-sm sm:h-12 sm:w-12" />
      <div className="leading-tight">
        <div className={`text-[13.5px] font-black sm:text-[15px] ${light ? 'text-cream-50' : 'text-brand-950'}`}>
          {settings.site_name || 'سنز اسکین شاپ'}
        </div>
        <div
          className={`mt-1 hidden text-[8.5px] font-bold tracking-[0.3em] sm:block ${
            light ? 'text-gold-300' : 'text-gold-600'
          }`}
          dir="ltr"
        >
          SENZ SKIN &amp; HAIR
        </div>
      </div>
    </div>
  );
}
