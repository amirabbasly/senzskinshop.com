import Link from 'next/link';

export default function SupportFab() {
  return (
    <Link
      href="/contact"
      aria-label="پشتیبانی"
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-xl bg-brand-200 py-2.5 pl-1.5 pr-1 text-brand-950 shadow-soft transition hover:bg-brand-300 lg:hidden"
    >
      <img
        src="/images/icons/service-consult.png"
        alt="پشتیبانی"
        className="h-6 w-6 rounded-full bg-white object-contain"
      />
      <span className="text-[8.5px] font-bold [writing-mode:vertical-rl]">پشتیبانی</span>
    </Link>
  );
}
