export function ArticleCardSkeleton({ large = false }: { large?: boolean }) {
  if (large) {
    return (
      <div className="bg-card rounded-xl overflow-hidden shadow-soft">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto bg-muted animate-shimmer" />
          <div className="p-6 md:p-8 space-y-3">
            <div className="h-5 w-24 bg-muted rounded animate-shimmer" />
            <div className="h-7 w-3/4 bg-muted rounded animate-shimmer" />
            <div className="h-4 w-1/2 bg-muted rounded animate-shimmer" />
            <div className="h-4 w-full bg-muted rounded animate-shimmer" />
            <div className="h-4 w-11/12 bg-muted rounded animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-soft">
      <div className="aspect-[16/10] bg-muted animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 bg-muted rounded animate-shimmer" />
        <div className="h-5 w-full bg-muted rounded animate-shimmer" />
        <div className="h-5 w-2/3 bg-muted rounded animate-shimmer" />
        <div className="h-3 w-1/2 bg-muted rounded animate-shimmer" />
      </div>
    </div>
  );
}