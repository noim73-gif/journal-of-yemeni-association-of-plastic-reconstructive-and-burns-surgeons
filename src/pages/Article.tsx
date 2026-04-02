import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleLikeButton } from "@/components/article/ArticleLikeButton";
import { ArticleComments } from "@/components/article/ArticleComments";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { ArrowLeft, Calendar, User, BookOpen, Share2, Bookmark, Loader2, ExternalLink, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import DOMPurify from "dompurify";

interface Article {
  id: string;
  title: string;
  abstract: string | null;
  content: string | null;
  introduction: string | null;
  methods: string | null;
  results: string | null;
  discussion: string | null;
  references: string | null;
  authors: string | null;
  category: string | null;
  image_url: string | null;
  volume: string | null;
  issue: string | null;
  doi: string | null;
  published_at: string | null;
  created_at: string;
}

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'hr', 'div', 'span', 'sub', 'sup', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'rel']
};

function AcademicSection({ title, content, numbering }: { title: string; content: string; numbering?: string }) {
  if (!content) return null;
  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
        {numbering && <span className="text-muted-foreground mr-2">{numbering}</span>}
        {title}
      </h2>
      <div
        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-li:text-foreground"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, SANITIZE_OPTIONS) }}
      />
    </section>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { addToHistory } = useReadingHistory();
  const { savedArticles, saveArticle, unsaveArticle } = useSavedArticles();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSaved = savedArticles.some((a) => a.article_id === id);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        logger.error("Error fetching article:", error);
        setError("Failed to load article");
      } else if (!data) {
        setError("Article not found");
      } else {
        setArticle(data);
        if (user) {
          addToHistory({
            id: data.id,
            title: data.title,
            authors: data.authors || undefined,
            image: data.image_url || undefined,
          });
        }
      }
      setLoading(false);
    }

    fetchArticle();
  }, [id, user, addToHistory]);

  // Google Scholar citation meta tags
  useEffect(() => {
    if (!article) return;

    const metaTags: HTMLMetaElement[] = [];

    const addMeta = (name: string, content: string) => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", name);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
      metaTags.push(tag);
    };

    addMeta("citation_title", article.title);
    addMeta("citation_journal_title", "Yemeni Journal of Plastic, Reconstructive and Burn Surgery");
    addMeta("citation_issn", "XXXX-XXXX");

    if (article.authors) {
      article.authors.split(",").forEach((author) => {
        addMeta("citation_author", author.trim());
      });
    }
    if (article.published_at) {
      addMeta("citation_publication_date", article.published_at.split("T")[0]);
    }
    if (article.volume) addMeta("citation_volume", article.volume);
    if (article.issue) addMeta("citation_issue", article.issue);
    if (article.doi) addMeta("citation_doi", article.doi);
    if (article.abstract) addMeta("citation_abstract", article.abstract.substring(0, 500));

    return () => {
      metaTags.forEach((tag) => tag.remove());
    };
  }, [article]);

  const handleSave = () => {
    if (!article) return;
    if (isSaved) {
      unsaveArticle(article.id);
    } else {
      saveArticle({
        id: article.id,
        title: article.title,
        authors: article.authors || undefined,
        image: article.image_url || undefined,
      });
    }
  };

  const handleExportJatsXml = async () => {
    if (!article) return;
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const url = `https://${projectId}.supabase.co/functions/v1/export-jats-xml?article_id=${article.id}`;
      const response = await fetch(url, {
        headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `article-${article.id}.xml`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("JATS XML exported successfully");
    } catch (err) {
      logger.error("JATS XML export error:", err);
      toast.error("Failed to export JATS XML");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">{error || "Article not found"}</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasAcademicSections = article.introduction || article.methods || article.results || article.discussion || article.references;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative">
          {article.image_url && (
            <div className="absolute inset-0 h-[400px]">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
            </div>
          )}
          <div className="relative container mx-auto px-4 pt-8 pb-16">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>

            <div className={article.image_url ? "text-white" : ""}>
              {article.category && (
                <Badge variant="featured" className="mb-4">
                  {article.category}
                </Badge>
              )}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm opacity-80 mb-6">
                {article.authors && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.authors}</span>
                  </div>
                )}
                {article.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(article.published_at), "MMMM d, yyyy")}</span>
                  </div>
                )}
                {article.volume && article.issue && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Vol. {article.volume}, Issue {article.issue}</span>
                  </div>
                )}
              </div>
              
              {article.doi && (
                <div className="mt-4">
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm font-mono transition-colors"
                  >
                    <span className="opacity-70">DOI:</span>
                    <span>{article.doi}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <ArticleLikeButton articleId={article.id} />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className={isSaved ? "text-primary" : ""}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={handleExportJatsXml}>
                    <FileCode2 className="h-4 w-4 mr-2" />
                    JATS XML
                  </Button>
                )}
              </div>
            </div>

            {/* Academic Structured Sections */}
            {hasAcademicSections ? (
              <div className="space-y-2">
                {/* Abstract */}
                {article.abstract && (
                  <section className="mb-10 bg-muted/50 rounded-lg p-6 border border-border">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">
                      Abstract
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{article.abstract}</p>
                  </section>
                )}

                <AcademicSection title="Introduction" content={article.introduction || ""} numbering="1." />
                <AcademicSection title="Methods" content={article.methods || ""} numbering="2." />
                <AcademicSection title="Results" content={article.results || ""} numbering="3." />
                <AcademicSection title="Discussion" content={article.discussion || ""} numbering="4." />
                <AcademicSection title="References" content={article.references || ""} numbering="5." />
              </div>
            ) : (
              <>
                {/* Fallback: legacy single-content articles */}
                {article.abstract && (
                  <div className="mb-8">
                    <h2 className="font-serif text-xl font-semibold mb-3">Abstract</h2>
                    <p className="text-muted-foreground leading-relaxed">{article.abstract}</p>
                  </div>
                )}

                {article.content && (
                  <div 
                    className="prose prose-lg max-w-none mb-12 prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-li:text-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(article.content, SANITIZE_OPTIONS)
                    }}
                  />
                )}
              </>
            )}

            <Separator className="my-12" />

            {/* Comments Section */}
            <ArticleComments articleId={article.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
