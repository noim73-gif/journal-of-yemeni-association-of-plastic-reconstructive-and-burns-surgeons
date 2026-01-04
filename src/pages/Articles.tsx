import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, User, Tag, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublishedArticles } from "@/hooks/useArticles";

const ARTICLES_PER_PAGE = 10;

interface VolumeIssue {
  volume: string;
  issue: string;
  label: string;
}

export default function Articles() {
  const { articles, loading } = usePublishedArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedVolume = searchParams.get("volume") || "all";
  const selectedIssue = searchParams.get("issue") || "all";

  // Extract unique categories from articles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((article) => {
      if (article.category) {
        cats.add(article.category.trim());
      }
    });
    return Array.from(cats).sort();
  }, [articles]);

  // Extract unique volumes and issues, sorted descending (newest first)
  const volumeIssueOptions = useMemo(() => {
    const volumeIssueMap = new Map<string, VolumeIssue>();
    
    articles.forEach((article) => {
      if (article.volume && article.issue) {
        const key = `${article.volume}-${article.issue}`;
        if (!volumeIssueMap.has(key)) {
          volumeIssueMap.set(key, {
            volume: article.volume,
            issue: article.issue,
            label: `Vol. ${article.volume}, Issue ${article.issue}`,
          });
        }
      }
    });

    // Sort by volume (descending) then issue (descending)
    return Array.from(volumeIssueMap.values()).sort((a, b) => {
      const volCompare = parseInt(b.volume) - parseInt(a.volume);
      if (volCompare !== 0) return volCompare;
      return parseInt(b.issue) - parseInt(a.issue);
    });
  }, [articles]);

  // Get unique volumes
  const volumes = useMemo(() => {
    const vols = new Set<string>();
    articles.forEach((article) => {
      if (article.volume) vols.add(article.volume);
    });
    return Array.from(vols).sort((a, b) => parseInt(b) - parseInt(a));
  }, [articles]);

  // Get issues for selected volume
  const issuesForVolume = useMemo(() => {
    if (selectedVolume === "all") return [];
    const issues = new Set<string>();
    articles.forEach((article) => {
      if (article.volume === selectedVolume && article.issue) {
        issues.add(article.issue);
      }
    });
    return Array.from(issues).sort((a, b) => parseInt(b) - parseInt(a));
  }, [articles, selectedVolume]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.abstract?.toLowerCase().includes(query) ||
          article.authors?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (article) => article.category?.trim() === selectedCategory
      );
    }

    // Filter by volume
    if (selectedVolume !== "all") {
      result = result.filter((article) => article.volume === selectedVolume);
    }

    // Filter by issue
    if (selectedIssue !== "all") {
      result = result.filter((article) => article.issue === selectedIssue);
    }

    // Sort by volume (desc), issue (desc), then by published date (desc)
    result.sort((a, b) => {
      // First by volume
      const volA = parseInt(a.volume || "0");
      const volB = parseInt(b.volume || "0");
      if (volB !== volA) return volB - volA;

      // Then by issue
      const issueA = parseInt(a.issue || "0");
      const issueB = parseInt(b.issue || "0");
      if (issueB !== issueA) return issueB - issueA;

      // Finally by published date
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    });

    return result;
  }, [articles, searchQuery, selectedCategory, selectedVolume, selectedIssue]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Navigation helpers
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVolumeChange = (volume: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("volume", volume);
    params.set("issue", "all");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleIssueChange = (issue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("issue", issue);
    params.set("page", "1");
    setSearchParams(params);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate citation reference
  const getCitationRef = (article: typeof articles[0], index: number) => {
    const globalIndex = startIndex + index + 1;
    if (article.volume && article.issue) {
      return `${article.volume}(${article.issue}):${globalIndex}`;
    }
    return globalIndex.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Browse Articles
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our collection of peer-reviewed research articles
          </p>
        </div>

        {/* Volume/Issue Navigation - Academic Style */}
        {volumeIssueOptions.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold text-foreground">Browse by Volume & Issue</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedVolume} onValueChange={handleVolumeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Volumes</SelectItem>
                  {volumes.map((vol) => (
                    <SelectItem key={vol} value={vol}>
                      Volume {vol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedVolume !== "all" && issuesForVolume.length > 0 && (
                <Select value={selectedIssue} onValueChange={handleIssueChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    {issuesForVolume.map((iss) => (
                      <SelectItem key={iss} value={iss}>
                        Issue {iss}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Search and Category Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all" || selectedVolume !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedVolume !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Volume {selectedVolume}{selectedIssue !== "all" ? `, Issue ${selectedIssue}` : ""}
                  <button
                    onClick={() => {
                      handleVolumeChange("all");
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  handleVolumeChange("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            {loading ? (
              "Loading articles..."
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {startIndex + 1}–{Math.min(endIndex, filteredArticles.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filteredArticles.length}
                </span>{" "}
                article{filteredArticles.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Articles List - Academic Journal Style */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6">
                <div className="flex gap-6">
                  <Skeleton className="h-32 w-48 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                handleVolumeChange("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="group block bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
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
                      {/* Citation Reference */}
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        Ref: {getCitationRef(article, index)}
                      </span>
                      
                      {/* Category Badge */}
                      {article.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-accent" />
                          <span className="text-xs font-medium text-accent uppercase tracking-wide">
                            {article.category}
                          </span>
                        </div>
                      )}

                      {/* Volume/Issue */}
                      {article.volume && article.issue && (
                        <span className="text-xs text-muted-foreground">
                          Vol. {article.volume}, Issue {article.issue}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {/* Authors */}
                    {article.authors && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span>{article.authors}</span>
                      </div>
                    )}

                    {/* Abstract */}
                    {article.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {article.abstract}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Published: {formatDate(article.published_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            role="navigation"
            aria-label="Pagination"
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-lg border border-border p-4"
          >
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-full sm:w-auto gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="w-10 h-10"
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className="px-2 text-muted-foreground">…</span>
                  )}
                </>
              )}

              {/* Page numbers around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                  return false;
                })
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10"
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 text-muted-foreground">…</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className="w-10 h-10"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-full sm:w-auto gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        )}

        {/* Citation Info */}
        {filteredArticles.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Citation Format:</strong> Volume(Issue):Article Number — Example: 12(3):45 refers to Volume 12, Issue 3, Article 45
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
