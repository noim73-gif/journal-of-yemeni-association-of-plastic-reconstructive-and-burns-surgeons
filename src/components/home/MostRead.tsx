import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Eye } from "lucide-react";
import { SectionBand } from "./SectionBand";
import { ArticleCardSkeleton } from "@/components/skeletons/ArticleCardSkeleton";

export function MostRead() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["home-most-read"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, authors, category, image_url, view_count, published_at")
        .not("published_at", "is", null)
        .order("view_count", { ascending: false, nullsFirst: false })
        .limit(3);
      return data ?? [];
    },
  });

  if (!isLoading && (!articles || articles.length === 0)) return null;

  return (
    <SectionBand
      alt
      eyebrow="Trending"
      title="Most read this month"
      description="The studies clinicians and researchers are returning to right now."
      action={
        <Link to="/articles" className="text-primary font-medium hover:underline whitespace-nowrap">
          Browse all articles →
        </Link>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [0, 1, 2].map((i) => <ArticleCardSkeleton key={i} />)
          : articles!.map((article, idx) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 border border-border/40 flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/40" />
                  )}
                  <div className="absolute top-3 left-3 bg-background/95 backdrop-blur text-primary font-serif text-lg font-bold tabular-nums w-9 h-9 rounded-full flex items-center justify-center shadow-soft">
                    {idx + 1}
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-overline !text-accent-foreground">
                      <Flame className="h-3 w-3" />
                      Hot
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {article.category && (
                    <div className="text-overline !text-accent mb-2">{article.category}</div>
                  )}
                  <h3 className="text-h4 text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-3 flex-1">
                    {article.title}
                  </h3>
                  <div className="text-caption flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="truncate mr-2 italic">{article.authors || "—"}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Eye className="h-3 w-3" />
                      {(article.view_count ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </SectionBand>
  );
}