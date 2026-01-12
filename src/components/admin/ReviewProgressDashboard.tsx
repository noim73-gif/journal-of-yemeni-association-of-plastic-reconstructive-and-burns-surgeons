import { useMemo } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useSubmissionReviews, SubmissionReview } from "@/hooks/useSubmissionReviews";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { format, parseISO, differenceInDays, subDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  under_review: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  revision_requested: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  submitted: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

const CHART_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444", "#8b5cf6"];

interface SubmissionWithReviews {
  submission: {
    id: string;
    title: string;
    status: string;
    created_at: string;
    category: string | null;
  };
  reviews: SubmissionReview[];
  reviewProgress: number;
  avgReviewTime: number | null;
}

export function ReviewProgressDashboard() {
  const { submissions, loading: submissionsLoading } = useSubmissions();
  const { reviews, loading: reviewsLoading } = useSubmissionReviews();

  const loading = submissionsLoading || reviewsLoading;

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const pendingSubmissions = submissions.filter(s => s.status === "pending").length;
    const underReview = submissions.filter(s => s.status === "under_review").length;
    const accepted = submissions.filter(s => s.status === "accepted").length;
    const rejected = submissions.filter(s => s.status === "rejected").length;

    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => r.status === "pending").length;
    const completedReviews = reviews.filter(r => r.status === "completed").length;
    const inProgressReviews = reviews.filter(r => r.status === "in_progress").length;

    // Calculate average review time
    const completedWithTime = reviews.filter(r => r.completed_at && r.assigned_at);
    const avgReviewDays = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, r) => {
          const days = differenceInDays(parseISO(r.completed_at!), parseISO(r.assigned_at));
          return sum + days;
        }, 0) / completedWithTime.length
      : 0;

    // Review completion rate
    const reviewCompletionRate = totalReviews > 0 
      ? Math.round((completedReviews / totalReviews) * 100) 
      : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentSubmissions = submissions.filter(s => 
      parseISO(s.created_at) > sevenDaysAgo
    ).length;

    return {
      totalSubmissions,
      pendingSubmissions,
      underReview,
      accepted,
      rejected,
      totalReviews,
      pendingReviews,
      completedReviews,
      inProgressReviews,
      avgReviewDays: Math.round(avgReviewDays * 10) / 10,
      reviewCompletionRate,
      recentSubmissions,
    };
  }, [submissions, reviews]);

  // Submission status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    submissions.forEach(s => {
      statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.replace("_", " "),
      value,
    }));
  }, [submissions]);

  // Monthly submission trends
  const monthlyTrends = useMemo(() => {
    const months: Record<string, { submissions: number; reviews: number }> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = format(date, "MMM yyyy");
      months[key] = { submissions: 0, reviews: 0 };
    }

    submissions.forEach(s => {
      const key = format(parseISO(s.created_at), "MMM yyyy");
      if (months[key]) {
        months[key].submissions++;
      }
    });

    reviews.forEach(r => {
      const key = format(parseISO(r.assigned_at), "MMM yyyy");
      if (months[key]) {
        months[key].reviews++;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [submissions, reviews]);

  // Submissions with their review progress
  const submissionsWithProgress = useMemo<SubmissionWithReviews[]>(() => {
    return submissions
      .filter(s => s.status === "under_review" || s.status === "pending")
      .slice(0, 10)
      .map(submission => {
        const submissionReviews = reviews.filter(r => r.submission_id === submission.id);
        const completedCount = submissionReviews.filter(r => r.status === "completed").length;
        const totalCount = submissionReviews.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        // Calculate average time for completed reviews
        const completedReviews = submissionReviews.filter(r => r.completed_at);
        const avgTime = completedReviews.length > 0
          ? completedReviews.reduce((sum, r) => {
              return sum + differenceInDays(parseISO(r.completed_at!), parseISO(r.assigned_at));
            }, 0) / completedReviews.length
          : null;

        return {
          submission: {
            id: submission.id,
            title: submission.title,
            status: submission.status,
            created_at: submission.created_at,
            category: submission.category,
          },
          reviews: submissionReviews,
          reviewProgress: Math.round(progress),
          avgReviewTime: avgTime ? Math.round(avgTime) : null,
        };
      });
  }, [submissions, reviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          description={`${stats.recentSubmissions} in last 7 days`}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Under Review"
          value={stats.underReview}
          description={`${stats.pendingSubmissions} pending`}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Review Completion"
          value={`${stats.reviewCompletionRate}%`}
          description={`${stats.completedReviews} of ${stats.totalReviews} reviews`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Avg. Review Time"
          value={`${stats.avgReviewDays} days`}
          description="From assignment to completion"
          icon={TrendingUp}
          variant="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Submission & Review Trends
            </CardTitle>
            <CardDescription>
              Monthly overview of submissions and reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="submissions" fill="hsl(var(--primary))" name="Submissions" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="hsl(var(--muted-foreground))" name="Reviews Assigned" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Submission Status Distribution
            </CardTitle>
            <CardDescription>
              Current status breakdown of all submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Review Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Submission Review Progress
          </CardTitle>
          <CardDescription>
            Track review completion for submissions currently under review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissionsWithProgress.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No submissions currently under review
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {submissionsWithProgress.map((item) => (
                  <div key={item.submission.id} className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.submission.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={statusColors[item.submission.status] || ""}>
                            {item.submission.status.replace("_", " ")}
                          </Badge>
                          {item.submission.category && (
                            <Badge variant="outline">{item.submission.category}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(item.submission.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">{item.reviews.length} reviewers</p>
                        {item.avgReviewTime !== null && (
                          <p className="text-xs text-muted-foreground">
                            Avg: {item.avgReviewTime} days
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Review Progress</span>
                        <span className="font-medium">{item.reviewProgress}%</span>
                      </div>
                      <Progress value={item.reviewProgress} className="h-2" />
                    </div>

                    {item.reviews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                review.status === "completed"
                                  ? "bg-green-500"
                                  : review.status === "in_progress"
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span>{review.reviewer_name || "Reviewer"}</span>
                            {review.recommendation && (
                              <Badge variant="outline" className="ml-1 text-xs py-0 px-1">
                                {review.recommendation.replace("_", " ")}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Review Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgressReviews}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedReviews}</p>
                <p className="text-sm text-muted-foreground">Completed Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
