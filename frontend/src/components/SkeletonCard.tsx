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