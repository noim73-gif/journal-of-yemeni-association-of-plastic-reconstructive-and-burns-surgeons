import { useState, useMemo, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
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
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { IssueBanner } from "@/components/articles/IssueBanner";
import { ViewModeToggle } from "@/components/articles/ViewModeToggle";

const ARTICLES_PER_PAGE = 10;

interface VolumeIssue {
  volume: string;
  issue: string;
  label: string;
}

export default function Articles() {
  usePageTitle("Browse Articles");
  const { articles, loading, error } = usePublishedArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("compact");
  const [currentIssueResolved, setCurrentIssueResolved] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedVolume = searchParams.get("volume") || "all";
  const selectedIssue = searchParams.get("issue") || "all";

  const categories = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((article) => {
      if (article.category) cats.add(article.category.trim());
    });
    return Array.from(cats).sort();
  }, [articles]);

  const volumeIssueOptions = useMemo(() => {
    const map = new Map<string, VolumeIssue>();
    articles.forEach((article) => {
      if (article.volume && article.issue) {
        const key = `${article.volume}-${article.issue}`;
        if (!map.has(key)) {
          map.set(key, {
            volume: article.volume,
            issue: article.issue,
            label: `Vol. ${article.volume}, Issue ${article.issue}`,
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const volCompare = parseInt(b.volume) - parseInt(a.volume);
      if (volCompare !== 0) return volCompare;
      return parseInt(b.issue) - parseInt(a.issue);
    });
  }, [articles]);

  // Auto-resolve ?issue=current
  useEffect(() => {
    if (currentIssueResolved || loading || articles.length === 0) return;
    if (searchParams.get("issue") === "current") {
      const latest = volumeIssueOptions[0];
      if (latest) {
        const params = new URLSearchParams(searchParams);
        params.set("volume", latest.volume);
        params.set("issue", latest.issue);
        params.set("page", "1");
        setSearchParams(params, { replace: true });
      }
      setCurrentIssueResolved(true);
    }
  }, [articles, loading, volumeIssueOptions, searchParams, currentIssueResolved, setSearchParams]);

  const volumes = useMemo(() => {
    const vols = new Set<string>();
    articles.forEach((article) => {
      if (article.volume) vols.add(article.volume);
    });
    return Array.from(vols).sort((a, b) => parseInt(b) - parseInt(a));
  }, [articles]);

  const issuesForVolume = useMemo(() => {
    if (selectedVolume === "all") return [];
    const issues = new Set<string>();
    articles.forEach((article) => {
      if (article.volume === selectedVolume && article.issue) issues.add(article.issue);
    });
    return Array.from(issues).sort((a, b) => parseInt(b) - parseInt(a));
  }, [articles, selectedVolume]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.abstract?.toLowerCase().includes(query) ||
          a.authors?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category?.trim() === selectedCategory);
    }

    if (selectedVolume !== "all") {
      result = result.filter((a) => a.volume === selectedVolume);
    }

    if (selectedIssue !== "all") {
      result = result.filter((a) => a.issue === selectedIssue);
    }

    result.sort((a, b) => {
      const volA = parseInt(a.volume || "0");
      const volB = parseInt(b.volume || "0");
      if (volB !== volA) return volB - volA;
      const issueA = parseInt(a.issue || "0");
      const issueB = parseInt(b.issue || "0");
      if (issueB !== issueA) return issueB - issueA;
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    });

    return result;
  }, [articles, searchQuery, selectedCategory, selectedVolume, selectedIssue]);

  // Group by category
  const groupedArticles = useMemo(() => {
    if (selectedVolume === "all" && selectedIssue === "all") return null; // Don't group when browsing all
    const groups = new Map<string, typeof filteredArticles>();
    filteredArticles.forEach((article) => {
      const cat = article.category?.trim() || "Other";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(article);
    });
    // Sort categories: common academic order
    const order = ["Original Article", "Review Article", "Case Report", "Editorial", "Letter to Editor", "Other"];
    return Array.from(groups.entries()).sort((a, b) => {
      const idxA = order.findIndex((o) => a[0].toLowerCase().includes(o.toLowerCase()));
      const idxB = order.findIndex((o) => b[0].toLowerCase().includes(o.toLowerCase()));
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
  }, [filteredArticles, selectedVolume, selectedIssue]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

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

  const isFilteringByIssue = selectedVolume !== "all" && selectedIssue !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Issue Banner or Generic Header */}
        {isFilteringByIssue ? (
          <IssueBanner volume={selectedVolume} issue={selectedIssue} />
        ) : (
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Browse Articles
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore our collection of peer-reviewed research articles
            </p>
          </div>
        )}

        {/* Volume/Issue Navigation */}
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
                    <SelectItem key={vol} value={vol}>Volume {vol}</SelectItem>
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
                      <SelectItem key={iss} value={iss}>Issue {iss}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Search, Category Filter, and View Mode Toggle */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all" || selectedVolume !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {selectedVolume !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Volume {selectedVolume}{selectedIssue !== "all" ? `, Issue ${selectedIssue}` : ""}
                  <button onClick={() => handleVolumeChange("all")} className="ml-1 hover:text-destructive">×</button>
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
            ) : error ? (
              <span className="text-destructive">Failed to load articles. Please refresh the page.</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredArticles.length > 0 ? startIndex + 1 : 0}–{Math.min(endIndex, filteredArticles.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">{filteredArticles.length}</span>{" "}
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

        {/* Articles List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
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
        ) : groupedArticles ? (
          // Grouped by category view (when filtering by specific issue)
          <div className="space-y-8">
            {groupedArticles.map(([category, categoryArticles]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-serif text-xl font-bold text-foreground">{category}</h2>
                  <Badge variant="outline" className="text-xs">
                    {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className={viewMode === "compact" ? "bg-card rounded-lg border border-border px-6" : "space-y-4"}>
                  {categoryArticles.map((article) => (
                    <ArticleListItem key={article.id} article={article} viewMode={viewMode} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat list with pagination (browsing all)
          <div className={viewMode === "compact" ? "bg-card rounded-lg border border-border px-6" : "space-y-4"}>
            {paginatedArticles.map((article) => (
              <ArticleListItem key={article.id} article={article} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !groupedArticles && (
          <nav
            role="navigation"
            aria-label="Pagination"
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-lg border border-border p-4"
          >
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-full sm:w-auto gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => goToPage(1)} className="w-10 h-10">1</Button>
                  {currentPage > 4 && <span className="px-2 text-muted-foreground">…</span>}
                </>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  return page >= currentPage - 2 && page <= currentPage + 2;
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

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">…</span>}
                  <Button variant="ghost" size="sm" onClick={() => goToPage(totalPages)} className="w-10 h-10">{totalPages}</Button>
                </>
              )}
            </div>

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
      </main>

      <Footer />
    </div>
  );
}
