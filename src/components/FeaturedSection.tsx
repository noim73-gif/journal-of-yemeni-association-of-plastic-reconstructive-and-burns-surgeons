import { FeaturedArticle } from "./FeaturedArticle";
import { usePublishedArticles } from "@/hooks/useArticles";
import { logger } from "@/lib/logger";
import { SectionBand } from "./home/SectionBand";
import { ArticleCardSkeleton } from "./skeletons/ArticleCardSkeleton";

// No fallback articles — show empty state when database is empty

export function FeaturedSection() {
  const { articles, loading, error } = usePublishedArticles();

  const featuredFromDb = articles.filter(a => a.is_featured || a.is_main_featured);
  const displayArticles = featuredFromDb.map(article => ({
    id: article.id,
    category: article.category || "Research",
    title: article.title,
    authors: article.authors || "",
    abstract: article.abstract || "",
    imageUrl: article.image_url || "",
    isMain: article.is_main_featured,
  }));

  if (!loading && displayArticles.length === 0) {
    return null;
  }

  const mainArticle = displayArticles.find(a => a.isMain) || displayArticles[0];
  const otherArticles = mainArticle
    ? displayArticles.filter(a => a.id !== mainArticle.id).slice(0, 3)
    : [];

  if (loading) {
    return (
      <SectionBand
        id="articles"
        eyebrow="Featured Research"
        title="Groundbreaking studies"
        description="Peer-reviewed work shaping the future of plastic surgery."
      >
        <div className="space-y-6">
          <ArticleCardSkeleton large />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        </div>
      </SectionBand>
    );
  }

  if (error && featuredFromDb.length === 0) {
    logger.error("Failed to load articles, showing fallback content:", error);
  }

  return (
    <SectionBand
      id="articles"
      eyebrow="Featured Research"
      title="Groundbreaking studies"
      description="Peer-reviewed work shaping the future of plastic surgery."
      action={
        <a href="/articles" className="text-primary font-medium hover:underline whitespace-nowrap">
          View all articles →
        </a>
      }
    >
      <div className="grid gap-6 lg:gap-8">
        {mainArticle && <FeaturedArticle {...mainArticle} isMain />}
        {otherArticles.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <FeaturedArticle key={article.id} {...article} isMain={false} />
            ))}
          </div>
        )}
      </div>
    </SectionBand>
  );
}
