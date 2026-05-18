import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface RelatedArticle {
  id: string;
  title: string;
  authors: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
  volume: string | null;
  issue: string | null;
}

interface RelatedArticlesProps {
  currentArticleId: string;
  category: string | null;
  volume: string | null;
  issue: string | null;
}

export function RelatedArticles({ currentArticleId, category, volume, issue }: RelatedArticlesProps) {
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [sameIssue, setSameIssue] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const relatedPromise = category
          ? supabase
              .from("articles")
              .select("id, title, authors, category, image_url, published_at, volume, issue")
              .eq("category", category)
              .neq("id", currentArticleId)
              .not("published_at", "is", null)
              .lte("published_at", new Date().toISOString())
              .order("published_at", { ascending: false })
              .limit(3)
              .then((r) => r)
          : Promise.resolve({ data: [] as RelatedArticle[] });

        const issuePromise = (volume && issue)
          ? supabase
              .from("articles")
              .select("id, title, authors, category, image_url, published_at, volume, issue")
              .eq("volume", volume)
              .eq("issue", issue)
              .neq("id", currentArticleId)
              .not("published_at", "is", null)
              .lte("published_at", new Date().toISOString())
              .order("article_number", { ascending: true })
              .limit(4)
              .then((r) => r)
          : Promise.resolve({ data: [] as RelatedArticle[] });

        const [relRes, issueRes] = await Promise.all([relatedPromise, issuePromise]);
        if (!active) return;
        setRelated((relRes.data as RelatedArticle[]) || []);
        setSameIssue((issueRes.data as RelatedArticle[]) || []);
      } catch (err) {
        logger.error("Failed to load related articles:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [currentArticleId, category, volume, issue]);

  if (loading) return null;
  if (related.length === 0 && sameIssue.length === 0) return null;

  return (
    <div className="space-y-12 not-prose">
      {related.length > 0 && (
        <Section
          title={`More in ${category}`}
          subtitle="Related research from the same category"
          articles={related}
        />
      )}
      {sameIssue.length > 0 && (
        <Section
          title={`From this Issue · Vol. ${volume}, Issue ${issue}`}
          subtitle="Other articles published in this issue"
          articles={sameIssue}
        />
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  articles,
}: {
  title: string;
  subtitle: string;
  articles: RelatedArticle[];
}) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Link
            key={a.id}
            to={`/article/${a.id}`}
            className="group flex gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-elegant hover:border-primary/30 transition-all"
          >
            <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/30 font-serif text-2xl">
                  YJ
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {a.title}
              </h4>
              {a.authors && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{a.authors}</p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                {a.published_at && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(a.published_at), "MMM yyyy")}
                  </span>
                )}
                {a.volume && a.issue && (
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Vol. {a.volume}({a.issue})
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}