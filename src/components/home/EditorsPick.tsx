import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award } from "lucide-react";
import { SectionBand } from "./SectionBand";
import { ArticleCardSkeleton } from "@/components/skeletons/ArticleCardSkeleton";

export function EditorsPick() {
  const { data: article, isLoading } = useQuery({
    queryKey: ["home-editors-pick"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, abstract, authors, category, image_url, published_at")
        .not("published_at", "is", null)
        .eq("is_main_featured", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) return data;
      const fallback = await supabase
        .from("articles")
        .select("id, title, abstract, authors, category, image_url, published_at")
        .not("published_at", "is", null)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return fallback.data;
    },
  });

  if (!isLoading && !article) return null;

  return (
    <SectionBand
      eyebrow="Editor's Pick"
      title="Chosen by our editorial board"
      description="A single study our editors believe every plastic surgeon should read this month."
    >
      {isLoading ? (
        <ArticleCardSkeleton large />
      ) : article ? (
        <Link
          to={`/article/${article.id}`}
          className="group block bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border/50"
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-muted">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
              )}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-elegant">
                <Award className="h-3.5 w-3.5" strokeWidth={2.5} />
                Editor's Pick
              </div>
            </div>
            <div className="md:col-span-3 p-6 md:p-10 flex flex-col justify-center">
              {article.category && (
                <Badge variant="secondary" className="w-fit mb-4 uppercase tracking-wider text-[10px]">
                  {article.category}
                </Badge>
              )}
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-card-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                {article.title}
              </h3>
              {article.authors && (
                <p className="text-sm text-muted-foreground mb-4 italic">{article.authors}</p>
              )}
              {article.abstract && (
                <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                  {article.abstract}
                </p>
              )}
              <span className="inline-flex items-center text-primary font-semibold text-sm group/link">
                Read the full study
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      ) : null}
    </SectionBand>
  );
}