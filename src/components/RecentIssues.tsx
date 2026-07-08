import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { IssueCard } from "./IssueCard";
import { SectionBand } from "./home/SectionBand";
import { IssueCardSkeleton } from "./skeletons/IssueCardSkeleton";

interface IssueData {
  volume: string;
  issue: string;
  articleCount: number;
  latestDate: string;
  coverImage: string | null;
}

export function RecentIssues() {
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchIssues() {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("volume, issue, published_at, image_url")
          .not("published_at", "is", null)
          .not("volume", "is", null)
          .not("issue", "is", null)
          .order("volume", { ascending: false })
          .order("issue", { ascending: false });

        if (!isMounted) return;

        if (fetchError) {
          logger.error("Error fetching issues:", fetchError);
          setError(fetchError.message);
          return;
        }

        // Group by volume/issue
        const issueMap = new Map<string, IssueData>();
        
        data?.forEach((article) => {
          const key = `${article.volume}-${article.issue}`;
          if (!issueMap.has(key)) {
            issueMap.set(key, {
              volume: article.volume!,
              issue: article.issue!,
              articleCount: 1,
              latestDate: article.published_at!,
              coverImage: article.image_url,
            });
          } else {
            const existing = issueMap.get(key)!;
            existing.articleCount++;
            if (article.published_at! > existing.latestDate) {
              existing.latestDate = article.published_at!;
              if (article.image_url) existing.coverImage = article.image_url;
            }
          }
        });

        // Sort by volume desc, then issue desc and take top 4
        const sortedIssues = Array.from(issueMap.values())
          .sort((a, b) => {
            const volDiff = parseInt(b.volume) - parseInt(a.volume);
            if (volDiff !== 0) return volDiff;
            return parseInt(b.issue) - parseInt(a.issue);
          })
          .slice(0, 4);

        if (isMounted) {
          setIssues(sortedIssues);
        }
      } catch (err) {
        if (isMounted) {
          logger.error("Unexpected error fetching issues:", err);
          setError(err instanceof Error ? err.message : "Failed to load issues");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchIssues();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Programmatic gradient covers when no image is uploaded
  const gradients = [
    "linear-gradient(135deg, hsl(215 50% 23%), hsl(215 55% 18%))",
    "linear-gradient(135deg, hsl(215 50% 23%), hsl(12 76% 61%))",
    "linear-gradient(135deg, hsl(215 55% 18%), hsl(199 89% 48%))",
    "linear-gradient(135deg, hsl(12 76% 61%), hsl(215 50% 23%))",
  ];

  return (
    <SectionBand
      id="current-issue"
      alt
      eyebrow="Archive"
      title="Recent issues"
      description="Browse our latest published editions, organized by volume and issue."
      action={
        <Link to="/archive" className="text-primary font-medium hover:underline whitespace-nowrap">
          View full archive →
        </Link>
      }
    >
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {[0, 1, 2, 3].map((i) => (
            <IssueCardSkeleton key={i} />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No published issues yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {issues.map((issue, idx) => {
            const link = `/articles?volume=${issue.volume}&issue=${issue.issue}`;
            if (issue.coverImage) {
              return (
                <Link key={`${issue.volume}-${issue.issue}`} to={link}>
                  <IssueCard
                    volume={issue.volume}
                    issue={issue.issue}
                    date={formatDate(issue.latestDate)}
                    coverImage={issue.coverImage}
                    articleCount={issue.articleCount}
                  />
                </Link>
              );
            }
            // Programmatic cover
            return (
              <Link key={`${issue.volume}-${issue.issue}`} to={link} className="group cursor-pointer block">
                <div
                  className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-soft group-hover:shadow-elegant transition-all duration-300 mb-4 flex flex-col justify-between p-5 text-primary-foreground"
                  style={{ backgroundImage: gradients[idx % gradients.length] }}
                >
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase opacity-80 font-semibold">
                      YJPRBS
                    </div>
                    <div className="text-xs opacity-75 mt-1">{formatDate(issue.latestDate)}</div>
                  </div>
                  <div>
                    <div className="font-serif text-4xl font-bold leading-none">Vol.{issue.volume}</div>
                    <div className="font-serif text-xl mt-1">Issue {issue.issue}</div>
                    <div className="w-10 h-0.5 bg-accent mt-3 group-hover:w-16 transition-all duration-300" />
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {issue.articleCount} Articles
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SectionBand>
  );
}
