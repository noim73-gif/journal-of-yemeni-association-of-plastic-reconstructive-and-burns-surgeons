import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { IssueCard } from "./IssueCard";
import { Skeleton } from "./ui/skeleton";

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

  const defaultCover = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&q=80";

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
          <Link to="/articles" className="hidden md:block text-primary font-medium hover:underline">
            View Archive →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No published issues yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {issues.map((issue) => (
              <Link 
                key={`${issue.volume}-${issue.issue}`} 
                to={`/articles?volume=${issue.volume}&issue=${issue.issue}`}
              >
                <IssueCard
                  volume={issue.volume}
                  issue={issue.issue}
                  date={formatDate(issue.latestDate)}
                  coverImage={issue.coverImage || defaultCover}
                  articleCount={issue.articleCount}
                />
              </Link>
            ))}
          </div>
        )}

        <Link to="/articles" className="mt-8 block md:hidden text-center text-primary font-medium hover:underline">
          View Archive →
        </Link>
      </div>
    </section>
  );
}
