import { FeaturedArticle } from "./FeaturedArticle";
import { usePublishedArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback articles for when database is empty
const fallbackArticles = [
  {
    id: "fallback-1",
    category: "Original Research",
    title: "Long-Term Outcomes of Autologous Fat Grafting in Facial Rejuvenation: A 10-Year Follow-Up Study",
    authors: "Chen, M.D., Williams, Ph.D., & Anderson, M.D.",
    abstract: "This comprehensive longitudinal study evaluates patient satisfaction and clinical outcomes following autologous fat transfer procedures for facial volume restoration over a decade-long period.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    isMain: true,
  },
  {
    id: "fallback-2",
    category: "Systematic Review",
    title: "Microsurgical Breast Reconstruction: A Meta-Analysis of DIEP vs. Free TRAM Flaps",
    authors: "Rodriguez, M.D. et al.",
    abstract: "Comparative analysis of deep inferior epigastric perforator and free transverse rectus abdominis myocutaneous flaps.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  },
  {
    id: "fallback-3",
    category: "Clinical Trial",
    title: "Novel Biodegradable Scaffold for Auricular Reconstruction in Microtia",
    authors: "Park, M.D., Kim, Ph.D.",
    abstract: "First-in-human trial results of a 3D-printed biodegradable framework for ear reconstruction.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80",
  },
  {
    id: "fallback-4",
    category: "Technique",
    title: "Precision Rhinoplasty: AI-Assisted Surgical Planning and Outcomes",
    authors: "Martinez, M.D., Lee, M.D.",
    abstract: "Integration of artificial intelligence in preoperative planning for complex revision rhinoplasty cases.",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
  },
];

export function FeaturedSection() {
  const { articles, loading, error } = usePublishedArticles();

  // Get featured articles from database, or use fallbacks
  const featuredFromDb = articles.filter(a => a.is_featured || a.is_main_featured);
  const displayArticles = featuredFromDb.length > 0 
    ? featuredFromDb.map(article => ({
        id: article.id,
        category: article.category || "Research",
        title: article.title,
        authors: article.authors || "",
        abstract: article.abstract || "",
        imageUrl: article.image_url || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
        isMain: article.is_main_featured,
      }))
    : fallbackArticles;

  const mainArticle = displayArticles.find(a => a.isMain) || displayArticles[0];
  const otherArticles = displayArticles.filter(a => a.id !== mainArticle.id).slice(0, 3);

  if (loading) {
    return (
      <section id="articles" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  // Show fallback content on error instead of blocking UI
  if (error && featuredFromDb.length === 0) {
    console.warn("Failed to load articles, showing fallback content:", error);
  }

  return (
    <section id="articles" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Research
            </h2>
            <p className="text-muted-foreground">
              Groundbreaking studies shaping the future of plastic surgery
            </p>
          </div>
          <a href="#" className="hidden md:block text-primary font-medium hover:underline">
            View All Articles →
          </a>
        </div>

        <div className="grid gap-6 lg:gap-8">
          {/* Main featured article */}
          <FeaturedArticle {...mainArticle} isMain />

          {/* Other articles grid */}
          {otherArticles.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article) => (
                <FeaturedArticle key={article.id} {...article} isMain={false} />
              ))}
            </div>
          )}
        </div>

        <a href="#" className="mt-8 block md:hidden text-center text-primary font-medium hover:underline">
          View All Articles →
        </a>
      </div>
    </section>
  );
}
