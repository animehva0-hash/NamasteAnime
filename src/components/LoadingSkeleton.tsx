export function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border/20">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[480px] rounded-2xl skeleton mb-8" />
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="w-full h-[300px] skeleton rounded-2xl" />
      <div className="flex gap-6">
        <div className="w-48 h-72 skeleton rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-8 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/2" />
          <div className="h-20 skeleton rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 skeleton rounded" />
            <div className="h-6 w-16 skeleton rounded" />
            <div className="h-6 w-16 skeleton rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
