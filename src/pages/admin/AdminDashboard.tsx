import { useArticles } from "@/hooks/useArticles";
import { StatsCard } from "@/components/admin/StatsCard";
import { SubmissionChart } from "@/components/admin/SubmissionChart";
import { FileText, CheckCircle, Clock, Star, Loader2 } from "lucide-react";
import { format, subMonths, parseISO } from "date-fns";

export default function AdminDashboard() {
  const { articles, loading } = useArticles();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const publishedArticles = articles.filter((a) => a.published_at);
  const draftArticles = articles.filter((a) => !a.published_at);
  const featuredArticles = articles.filter((a) => a.is_featured || a.is_main_featured);

  // Calculate this month's stats
  const thisMonth = new Date();
  const lastMonth = subMonths(thisMonth, 1);
  
  const thisMonthArticles = articles.filter((a) => {
    const created = parseISO(a.created_at);
    return created >= subMonths(thisMonth, 1);
  });

  const lastMonthArticles = articles.filter((a) => {
    const created = parseISO(a.created_at);
    return created >= subMonths(lastMonth, 1) && created < subMonths(thisMonth, 1);
  });

  const growthRate = lastMonthArticles.length > 0
    ? Math.round(((thisMonthArticles.length - lastMonthArticles.length) / lastMonthArticles.length) * 100)
    : thisMonthArticles.length > 0 ? 100 : 0;

  // Get recent articles
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your journal's performance and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Articles"
          value={articles.length}
          description="All time submissions"
          icon={FileText}
          trend={growthRate !== 0 ? { value: growthRate, isPositive: growthRate > 0 } : undefined}
        />
        <StatsCard
          title="Published"
          value={publishedArticles.length}
          description="Live articles"
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Drafts"
          value={draftArticles.length}
          description="Pending review"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Featured"
          value={featuredArticles.length}
          description="Highlighted articles"
          icon={Star}
          variant="info"
        />
      </div>

      {/* Submission Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold mb-1">Submission Statistics</h2>
          <p className="text-sm text-muted-foreground">
            Articles submitted, published, and in drafts over the last 12 months
          </p>
        </div>
        <SubmissionChart articles={articles} />
      </div>

      {/* Recent Articles */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold mb-1">Recent Submissions</h2>
          <p className="text-sm text-muted-foreground">
            Latest articles added to the journal
          </p>
        </div>
        <div className="space-y-4">
          {recentArticles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No articles yet. Create your first article!
            </p>
          ) : (
            recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{article.authors || "Unknown author"}</span>
                    <span>•</span>
                    <span>{format(parseISO(article.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {article.published_at ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                      Draft
                    </span>
                  )}
                  {article.is_featured && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
