import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonMetricCard() {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16 ml-auto" />
      <Skeleton className="h-4 w-40 hidden md:block" />
      <Skeleton className="h-4 w-16 hidden sm:block" />
    </div>
  );
}