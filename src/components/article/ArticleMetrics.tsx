import { Eye, Heart, MessageSquare, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArticleMetricsProps {
  articleId: string;
  viewCount: number;
}

/**
 * Compact metrics strip shown on the article page.
 * Views come from articles.view_count (already incremented per session).
 * Likes + comments are counted live from their respective tables.
 * Citations are a placeholder (0) until CrossRef integration lands.
 */
export function ArticleMetrics({ articleId, viewCount }: ArticleMetricsProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [comments, setComments] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase.from("article_likes").select("*", { count: "exact", head: true }).eq("article_id", articleId),
      supabase.from("article_comments").select("*", { count: "exact", head: true }).eq("article_id", articleId),
    ]).then(([likesRes, commentsRes]) => {
      if (!active) return;
      setLikes(likesRes.count ?? 0);
      setComments(commentsRes.count ?? 0);
    });
    return () => {
      active = false;
    };
  }, [articleId]);

  const items: { icon: typeof Eye; label: string; value: number | null }[] = [
    { icon: Eye, label: "Views", value: viewCount },
    { icon: Heart, label: "Likes", value: likes },
    { icon: MessageSquare, label: "Comments", value: comments },
    { icon: Quote, label: "Citations", value: 0 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 not-prose">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/40 border border-border"
        >
          <Icon className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <div className="font-serif text-xl font-semibold text-foreground leading-tight tabular-nums">
              {value === null ? "—" : value.toLocaleString()}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}