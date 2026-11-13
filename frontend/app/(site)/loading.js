export default function SiteLoading() {
  return (
    <div className="container-page animate-pulse py-10">
      <div className="h-64 rounded-[2rem] bg-cream-200/70 sm:h-[420px]" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-cream-200/60" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-3xl border border-cream-200 bg-white p-3">
            <div className="aspect-square rounded-2xl bg-cream-200/70" />
            <div className="h-3 w-4/5 rounded bg-cream-200/80" />
            <div className="h-3 w-1/2 rounded bg-cream-200/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
