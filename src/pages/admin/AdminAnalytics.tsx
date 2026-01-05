import { useMemo } from "react";
import { useArticles } from "@/hooks/useArticles";
import { SubmissionChart } from "@/components/admin/SubmissionChart";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { FileText, BookOpen, Layers, Award, Loader2 } from "lucide-react";
import { parseISO, format } from "date-fns";

const COLORS = [
  "hsl(215, 50%, 23%)",
  "hsl(142, 76%, 36%)",
  "hsl(45, 93%, 47%)",
  "hsl(12, 76%, 61%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 80%, 50%)",
];

export default function AdminAnalytics() {
  const { articles, loading } = useArticles();

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    articles.forEach((article) => {
      const cat = article.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [articles]);

  const volumeData = useMemo(() => {
    const volumes: Record<string, { published: number; drafts: number }> = {};
    articles.forEach((article) => {
      const vol = article.volume || "No Volume";
      if (!volumes[vol]) {
        volumes[vol] = { published: 0, drafts: 0 };
      }
      if (article.published_at) {
        volumes[vol].published += 1;
      } else {
        volumes[vol].drafts += 1;
      }
    });
    return Object.entries(volumes)
      .map(([volume, data]) => ({
        volume,
        ...data,
        total: data.published + data.drafts,
      }))
      .sort((a, b) => b.total - a.total);
  }, [articles]);

  const categoryChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryData.forEach((cat, i) => {
      config[cat.name] = {
        label: cat.name,
        color: COLORS[i % COLORS.length],
      };
    });
    return config;
  }, [categoryData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const publishedCount = articles.filter((a) => a.published_at).length;
  const publishRate = articles.length > 0 
    ? Math.round((publishedCount / articles.length) * 100) 
    : 0;
  const uniqueVolumes = new Set(articles.map((a) => a.volume).filter(Boolean)).size;
  const uniqueCategories = new Set(articles.map((a) => a.category).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed statistics and insights about your journal
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Articles"
          value={articles.length}
          icon={FileText}
        />
        <StatsCard
          title="Publication Rate"
          value={`${publishRate}%`}
          description="Articles published"
          icon={Award}
          variant="success"
        />
        <StatsCard
          title="Volumes"
          value={uniqueVolumes}
          description="Unique volumes"
          icon={BookOpen}
          variant="info"
        />
        <StatsCard
          title="Categories"
          value={uniqueCategories}
          description="Topic areas"
          icon={Layers}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Timeline */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold mb-1">
              Submission Timeline
            </h2>
            <p className="text-sm text-muted-foreground">
              Monthly submission trends
            </p>
          </div>
          <SubmissionChart articles={articles} />
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold mb-1">
              Category Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Articles by research area
            </p>
          </div>
          {categoryData.length > 0 ? (
            <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Volume Breakdown */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold mb-1">
            Volume Breakdown
          </h2>
          <p className="text-sm text-muted-foreground">
            Articles organized by volume
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Volume
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Published
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Drafts
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Completion
                </th>
              </tr>
            </thead>
            <tbody>
              {volumeData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No volume data available
                  </td>
                </tr>
              ) : (
                volumeData.map((vol) => (
                  <tr
                    key={vol.volume}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-medium">{vol.volume}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-sm">
                        {vol.published}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-sm">
                        {vol.drafts}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      {vol.total}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${vol.total > 0 ? (vol.published / vol.total) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {vol.total > 0
                            ? Math.round((vol.published / vol.total) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
