import { IssueCard } from "./IssueCard";

const recentIssues = [
  {
    volume: "153",
    issue: "1",
    date: "January 2026",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&q=80",
    articleCount: 24,
  },
  {
    volume: "152",
    issue: "6",
    date: "December 2025",
    coverImage: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&q=80",
    articleCount: 22,
  },
  {
    volume: "152",
    issue: "5",
    date: "November 2025",
    coverImage: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&q=80",
    articleCount: 20,
  },
  {
    volume: "152",
    issue: "4",
    date: "October 2025",
    coverImage: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80",
    articleCount: 23,
  },
];

export function RecentIssues() {
  return (
    <section id="current-issue" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Recent Issues
            </h2>
            <p className="text-muted-foreground">
              Browse our latest published editions
            </p>
          </div>
          <a href="#" className="hidden md:block text-primary font-medium hover:underline">
            View Archive →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {recentIssues.map((issue, index) => (
            <IssueCard key={index} {...issue} />
          ))}
        </div>

        <a href="#" className="mt-8 block md:hidden text-center text-primary font-medium hover:underline">
          View Archive →
        </a>
      </div>
    </section>
  );
}
