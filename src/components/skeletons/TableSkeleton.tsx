import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  className?: string;
}

export const TableSkeleton = forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, className }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <div className="h-10 w-10 shrink-0 rounded-md animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 rounded animate-shimmer" />
            <div className="h-3 w-2/5 rounded animate-shimmer" />
          </div>
          <div className="h-6 w-20 shrink-0 rounded-full animate-shimmer" />
        </div>
      ))}
    </div>
  )
);
TableSkeleton.displayName = "TableSkeleton";
