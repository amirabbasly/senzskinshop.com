import Link from 'next/link';
import { Headset } from './Icons';

export default function SupportFab() {
  return (
    <Link
      href="/contact"
      aria-label="پشتیبانی"
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-xl bg-brand-700 py-2.5 pl-1.5 pr-1 text-cream-50 shadow-soft transition hover:bg-brand-800 lg:hidden"
    >
      <Headset className="h-4 w-4" />
      <span className="text-[8.5px] font-bold [writing-mode:vertical-rl]">پشتیبانی</span>
    </Link>
  );
}
