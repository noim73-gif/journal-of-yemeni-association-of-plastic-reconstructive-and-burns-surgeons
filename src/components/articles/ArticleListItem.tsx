import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, FileText, Share2, Quote, User, Calendar, Tag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import type { Article } from "@/hooks/useArticles";

type ArticleData = Pick<Article, "id" | "title" | "abstract" | "authors" | "category" | "doi" | "volume" | "issue" | "pages" | "published_at" | "image_url" | "view_count" | "article_number">;

interface ArticleListItemProps {
  article: ArticleData;
  viewMode: "cards" | "compact";
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function ArticleListItem({ article, viewMode }: ArticleListItemProps) {
  const [showAbstract, setShowAbstract] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Article link copied to clipboard");
  };

  const handleCite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const citation = `${article.authors || "Unknown"}. ${article.title}. YJPRBS. ${article.volume ? `${article.volume}` : ""}${article.issue ? `(${article.issue})` : ""}${article.pages ? `:${article.pages}` : ""}. ${article.doi ? `DOI: ${article.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    toast.success("Citation copied to clipboard");
  };

  const toggleAbstract = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAbstract(!showAbstract);
  };

  if (viewMode === "compact") {
    return (
      <div className="border-b border-border py-4 last:border-b-0">
        <div className="flex flex-col gap-2">
          {/* Title as link */}
          <Link
            to={`/article/${article.id}`}
            className="font-serif text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            {article.title}
          </Link>

          {/* Authors */}
          {article.authors && (
            <p className="text-sm text-muted-foreground">{article.authors}</p>
          )}

          {/* Meta row: DOI, pages, views */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {article.doi && (
              <span className="font-mono text-primary">
                DOI: {article.doi}
              </span>
            )}
            {article.pages && (
              <span>pp. {article.pages}</span>
            )}
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(article.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.view_count} views
            </span>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-1 mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
              onClick={toggleAbstract}
            >
              {showAbstract ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Abstract
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
              onClick={handleCite}
            >
              <Quote className="h-3 w-3" />
              Cite
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3" />
              Share
            </Button>
            <Link
              to={`/article/${article.id}`}
              className="inline-flex items-center gap-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText className="h-3 w-3" />
              Full Text
            </Link>
          </div>

          {/* Expandable abstract */}
          {showAbstract && article.abstract && (
            <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border text-sm text-muted-foreground leading-relaxed">
              {article.abstract}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cards view (original style with enhancements)
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <Link to={`/article/${article.id}`} className="group block">
        <div className="flex flex-col md:flex-row">
          {/* Article Image */}
          <div className="md:w-48 lg:w-56 flex-shrink-0">
            {article.image_url ? (
              <div className="aspect-video md:aspect-[4/3] overflow-hidden bg-muted h-full">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-video md:aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center h-full">
                <span className="font-serif text-3xl text-primary/30">YJ</span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {article.doi && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  DOI: {article.doi}
                </span>
              )}
              {article.category && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-accent" />
                  <span className="text-xs font-medium text-accent uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>
              )}
              {article.volume && article.issue && (
                <span className="text-xs text-muted-foreground">
                  Vol. {article.volume}, Issue {article.issue}
                </span>
              )}
              {article.pages && (
                <span className="text-xs text-muted-foreground">
                  pp. {article.pages}
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {article.authors && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <User className="h-3 w-3 flex-shrink-0" />
                <span>{article.authors}</span>
              </div>
            )}

            {article.abstract && !showAbstract && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {article.abstract}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {article.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.view_count} views
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action buttons outside the link */}
      <div className="flex items-center gap-1 px-6 pb-4 border-t border-border pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
          onClick={toggleAbstract}
        >
          {showAbstract ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Abstract
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
          onClick={handleCite}
        >
          <Quote className="h-3 w-3" />
          Cite
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
          onClick={handleShare}
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>
        <Link
          to={`/article/${article.id}`}
          className="inline-flex items-center gap-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary"
        >
          <FileText className="h-3 w-3" />
          Full Text
        </Link>
      </div>

      {/* Expandable abstract */}
      {showAbstract && article.abstract && (
        <div className="px-6 pb-4">
          <div className="p-3 bg-muted/50 rounded-md border border-border text-sm text-muted-foreground leading-relaxed">
            {article.abstract}
          </div>
        </div>
      )}
    </div>
  );
}
