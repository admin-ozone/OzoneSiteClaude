export default function TransparencyLoading() {
  return (
    <div className="min-h-screen bg-oz-black pt-24 pb-32 px-6">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8">

        {/* Header skeleton */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="h-3 w-32 bg-oz-surface rounded-sm animate-pulse" />
          <div className="h-10 w-64 bg-oz-surface rounded-sm animate-pulse" />
          <div className="h-4 w-96 bg-oz-surface rounded-sm animate-pulse" />
        </div>

        {/* Overall status banner skeleton */}
        <div className="h-20 bg-oz-surface border border-oz-border rounded-sm animate-pulse" />

        {/* Service rows skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-3 w-20 bg-oz-surface rounded-sm animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-oz-surface border border-oz-border rounded-sm animate-pulse" />
          ))}
        </div>

        {/* Architecture card skeleton */}
        <div className="h-36 bg-oz-surface border border-oz-border rounded-sm animate-pulse" />
      </div>
    </div>
  );
}