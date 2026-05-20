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

export function SkeletonActivityRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  );
}
