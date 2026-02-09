import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface VolumeIssue {
  volume: string;
  issue: string;
  articleCount: number;
  latestDate: string | null;
}

export default function Archive() {
  const [volumeIssues, setVolumeIssues] = useState<VolumeIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolumeIssues = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("volume, issue, published_at")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString());

      if (error) {
        logger.error("Error fetching archive data:", error);
        setLoading(false);
        return;
      }

      // Group by volume and issue
      const grouped = (data || []).reduce((acc, article) => {
        if (!article.volume || !article.issue) return acc;
        const key = `${article.volume}-${article.issue}`;
        if (!acc[key]) {
          acc[key] = {
            volume: article.volume,
            issue: article.issue,
            articleCount: 0,
            latestDate: null as string | null,
          };
        }
        acc[key].articleCount++;
        if (!acc[key].latestDate || (article.published_at && article.published_at > acc[key].latestDate)) {
          acc[key].latestDate = article.published_at;
        }
        return acc;
      }, {} as Record<string, VolumeIssue>);

      // Sort by volume desc, then issue desc
      const sorted = Object.values(grouped).sort((a, b) => {
        const volA = parseInt(a.volume) || 0;
        const volB = parseInt(b.volume) || 0;
        if (volB !== volA) return volB - volA;
        const issueA = parseInt(a.issue) || 0;
        const issueB = parseInt(b.issue) || 0;
        return issueB - issueA;
      });

      setVolumeIssues(sorted);
      setLoading(false);
    };

    fetchVolumeIssues();
  }, []);

  // Group by volume for display
  const groupedByVolume = useMemo(() => {
    return volumeIssues.reduce((acc, item) => {
      if (!acc[item.volume]) {
        acc[item.volume] = [];
      }
      acc[item.volume].push(item);
      return acc;
    }, {} as Record<string, VolumeIssue[]>);
  }, [volumeIssues]);

  const sortedVolumes = useMemo(() => {
    return Object.keys(groupedByVolume).sort((a, b) => {
      return (parseInt(b) || 0) - (parseInt(a) || 0);
    });
  }, [groupedByVolume]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Journal Archive
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse all published volumes and issues of the Youth Journal for 
            Pharmaceutical Research and Biological Sciences.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8">
            {[1, 2].map((i) => (
              <div key={i}>
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-40" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : volumeIssues.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">
              No Published Issues Yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for published volumes and issues.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedVolumes.map((volume) => (
              <section key={volume}>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    Volume {volume}
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    {groupedByVolume[volume].length} {groupedByVolume[volume].length === 1 ? "Issue" : "Issues"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedByVolume[volume]
                    .sort((a, b) => (parseInt(b.issue) || 0) - (parseInt(a.issue) || 0))
                    .map((item) => (
                      <Link
                        key={`${item.volume}-${item.issue}`}
                        to={`/articles?volume=${item.volume}&issue=${item.issue}`}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors">
                                Issue {item.issue}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                Vol. {item.volume}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>
                                {item.articleCount} {item.articleCount === 1 ? "Article" : "Articles"}
                              </span>
                            </div>
                            {item.latestDate && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(item.latestDate)}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
