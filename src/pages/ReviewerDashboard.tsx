import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useIsReviewer, Review } from "@/hooks/useReviews";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  ArrowLeft,
  Clock,
  CheckCircle,
  FileText,
  Eye,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isReviewer, loading: roleLoading } = useIsReviewer();
  const { reviews, loading: reviewsLoading, fetchMyReviews, submitReview: submitReviewHook } = useReviews();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [articleContent, setArticleContent] = useState<string>("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && user && !isReviewer) {
      toast.error("You don't have reviewer access");
      navigate("/");
    }
  }, [isReviewer, roleLoading, user, navigate]);

  useEffect(() => {
    if (user && isReviewer) {
      fetchMyReviews();
    }
  }, [user, isReviewer]);

  const handleViewArticle = async (review: Review) => {
    setSelectedReview(review);
    
    // Fetch full article content (single-blind: no author info shown)
    const { data } = await supabase
      .from("articles")
      .select("content")
      .eq("id", review.article_id)
      .single();
    
    setArticleContent(data?.content || "No content available");

    // Update status to in_progress if pending
    if (review.status === "pending") {
      await supabase
        .from("article_reviews")
        .update({ status: "in_progress" })
        .eq("id", review.id);
      fetchMyReviews();
    }
  };

  const handleStartReview = (review: Review) => {
    setSelectedReview(review);
    setIsReviewDialogOpen(true);
    setRecommendation("");
    setFeedback("");
    setPrivateNotes("");
  };

  const handleSubmitReview = async () => {
    if (!selectedReview || !recommendation) {
      toast.error("Please select a recommendation");
      return;
    }

    setIsSubmitting(true);
    const success = await submitReviewHook(
      selectedReview.id,
      recommendation,
      feedback,
      privateNotes
    );

    if (success) {
      setIsReviewDialogOpen(false);
      setSelectedReview(null);
      fetchMyReviews();
    }
    setIsSubmitting(false);
  };

  if (authLoading || roleLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isReviewer) {
    return null;
  }

  const pendingReviews = reviews.filter((r) => r.status === "pending" || r.status === "in_progress");
  const completedReviews = reviews.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-xl font-bold">Reviewer Dashboard</h1>
              <p className="text-sm text-muted-foreground">Single-blind peer review</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <Eye className="h-3 w-3 mr-1" />
            Reviewer
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
              <CardTitle className="text-3xl">{pendingReviews.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Awaiting your feedback
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Reviews</CardDescription>
              <CardTitle className="text-3xl">{completedReviews.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                Reviews submitted
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Assigned</CardDescription>
              <CardTitle className="text-3xl">{reviews.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                All time
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-semibold mb-4">Pending Reviews</h2>
            {pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending reviews. Check back later!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.article_title}</CardTitle>
                          <CardDescription className="mt-1">
                            {review.article_abstract?.slice(0, 150)}
                            {(review.article_abstract?.length || 0) > 150 ? "..." : ""}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className={statusColors[review.status]}>
                          {review.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Assigned: {format(parseISO(review.assigned_at), "MMM d, yyyy")}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewArticle(review)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Article
                          </Button>
                          <Button size="sm" onClick={() => handleStartReview(review)}>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {completedReviews.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-semibold mb-4">Completed Reviews</h2>
              <div className="grid gap-4">
                {completedReviews.map((review) => (
                  <Card key={review.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.article_title}</CardTitle>
                          <CardDescription>
                            Completed: {review.completed_at && format(parseISO(review.completed_at), "MMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className={statusColors[review.status]}>
                          {review.status}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* View Article Dialog */}
      <Dialog open={!!selectedReview && !isReviewDialogOpen} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReview?.article_title}</DialogTitle>
            <DialogDescription>
              Single-blind review - Author information hidden
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Abstract</h3>
              <p className="text-sm text-muted-foreground">{selectedReview?.article_abstract}</p>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: articleContent }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Close
            </Button>
            <Button onClick={() => selectedReview && handleStartReview(selectedReview)}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogDescription>
              Provide your assessment for: {selectedReview?.article_title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recommendation *</label>
              <Select value={recommendation} onValueChange={setRecommendation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">
                    Accept - Ready for publication
                  </SelectItem>
                  <SelectItem value="minor_revisions">
                    Minor Revisions - Small changes needed
                  </SelectItem>
                  <SelectItem value="major_revisions">
                    Major Revisions - Significant changes required
                  </SelectItem>
                  <SelectItem value="reject">
                    Reject - Not suitable for publication
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback to Author</label>
              <Textarea
                placeholder="Provide constructive feedback visible to the author..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Private Notes (Editor Only)</label>
              <Textarea
                placeholder="Confidential notes for the editor..."
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                rows={3}
                className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              />
              <p className="text-xs text-muted-foreground">
                These notes are only visible to the journal editor, not the author.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={!recommendation || isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
