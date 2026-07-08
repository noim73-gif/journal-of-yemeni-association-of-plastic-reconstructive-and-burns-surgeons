export function IssueCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] rounded-lg bg-muted animate-shimmer" />
      <div className="h-4 w-24 mx-auto bg-muted rounded animate-shimmer" />
    </div>
  );
}