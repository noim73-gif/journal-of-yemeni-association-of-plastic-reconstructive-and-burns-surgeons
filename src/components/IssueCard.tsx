interface IssueCardProps {
  volume: string;
  issue: string;
  date: string;
  coverImage: string;
  articleCount: number;
}

export function IssueCard({ volume, issue, date, coverImage, articleCount }: IssueCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-soft group-hover:shadow-elegant transition-all duration-300 mb-4">
        <img
          src={coverImage}
          alt={`Volume ${volume}, Issue ${issue}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-caption !text-primary-foreground/80 mb-1">{date}</div>
          <div className="text-primary-foreground font-serif font-semibold text-base">
            Vol. {volume}, Issue {issue}
          </div>
        </div>
      </div>
      <div className="text-center">
        <span className="text-meta">{articleCount} Articles</span>
      </div>
    </article>
  );
}
