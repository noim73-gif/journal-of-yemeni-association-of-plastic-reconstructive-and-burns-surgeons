import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  User
} from "lucide-react";

interface ReviewData {
  id: string;
  reviewer_id: string;
  status: string;
  recommendation: string | null;
  feedback: string | null;
  private_notes: string | null;
  assigned_at: string;
  completed_at: string | null;
  reviewer_name?: string;
  reviewer_avatar?: string;
}

interface SubmissionReviewPanelProps {
  submissionId: string;
}

const recommendationLabels: Record<string, { label: string; color: string }> = {
  accept: { label: "Accept", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  minor_revisions: { label: "Minor Revisions", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  major_revisions: { label: "Major Revisions", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  reject: { label: "Reject", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  in_progress: <AlertCircle className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
};

export function SubmissionReviewPanel({ submissionId }: SubmissionReviewPanelProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      
      const { data: reviewsData, error } = await supabase
        .from("submission_reviews")
        .select("*")
        .eq("submission_id", submissionId)
        .order("assigned_at", { ascending: true });

      if (error) {
        logger.error("Error fetching reviews:", error);
        setLoading(false);
        return;
      }

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      // Fetch reviewer profiles
      const reviewerIds = [...new Set(reviewsData.map((r) => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", reviewerIds);

      const reviewsWithDetails = reviewsData.map((review) => {
        const profile = profiles?.find((p) => p.user_id === review.reviewer_id);
        return {
          ...review,
          reviewer_name: profile?.full_name || "Unknown Reviewer",
          reviewer_avatar: profile?.avatar_url || undefined,
        };
      });

      setReviews(reviewsWithDetails);
      setLoading(false);
    }

    fetchReviews();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Peer Reviews</Label>
        <div className="animate-pulse bg-muted h-20 rounded-md" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Peer Reviews</Label>
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md text-center">
          No reviewers assigned yet
        </div>
      </div>
    );
  }

  const completedReviews = reviews.filter((r) => r.status === "completed");
  const pendingReviews = reviews.filter((r) => r.status !== "completed");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Peer Reviews</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{completedReviews.length}/{reviews.length} completed</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.reviewer_avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{review.reviewer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned: {format(parseISO(review.assigned_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusIcons[review.status]}
                <Badge 
                  variant="secondary" 
                  className={review.status === "completed" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : review.status === "in_progress"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }
                >
                  {review.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {review.status === "completed" && (
              <>
                <Separator />
                
                <div className="space-y-3">
                  {review.recommendation && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Recommendation:</span>
                      <Badge 
                        variant="secondary" 
                        className={recommendationLabels[review.recommendation]?.color}
                      >
                        {recommendationLabels[review.recommendation]?.label || review.recommendation}
                      </Badge>
                    </div>
                  )}

                  {review.feedback && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Feedback to Authors</span>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">
                        {review.feedback}
                      </p>
                    </div>
                  )}

                  {review.private_notes && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Private Notes (Editors Only)</span>
                      </div>
                      <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md whitespace-pre-wrap border border-amber-200 dark:border-amber-800">
                        {review.private_notes}
                      </p>
                    </div>
                  )}

                  {review.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Completed: {format(parseISO(review.completed_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Summary for editorial decision */}
      {completedReviews.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <Label className="text-sm font-medium">Review Summary</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              completedReviews.reduce((acc, r) => {
                if (r.recommendation) {
                  acc[r.recommendation] = (acc[r.recommendation] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>)
            ).map(([rec, count]) => (
              <Badge 
                key={rec} 
                variant="outline"
                className={recommendationLabels[rec]?.color}
              >
                {recommendationLabels[rec]?.label}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}