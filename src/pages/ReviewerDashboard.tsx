import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useIsReviewer, Review } from "@/hooks/useReviews";
import { useSubmissionReviews, SubmissionReview } from "@/hooks/useSubmissionReviews";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Inbox,
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
  const { reviews: articleReviews, loading: articleReviewsLoading, fetchMyReviews: fetchMyArticleReviews, submitReview: submitArticleReview } = useReviews();
  const { reviews: submissionReviews, loading: submissionReviewsLoading, fetchMyReviews: fetchMySubmissionReviews, submitReview: submitSubmissionReview } = useSubmissionReviews();
  
  const [selectedArticleReview, setSelectedArticleReview] = useState<Review | null>(null);
  const [selectedSubmissionReview, setSelectedSubmissionReview] = useState<SubmissionReview | null>(null);
  const [articleContent, setArticleContent] = useState<string>("");
  const [submissionContent, setSubmissionContent] = useState<{ abstract: string; keywords: string; category: string }>({ abstract: "", keywords: "", category: "" });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<"article" | "submission">("article");
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
      fetchMyArticleReviews();
      fetchMySubmissionReviews();
    }
  }, [user, isReviewer]);

  const handleViewArticle = async (review: Review) => {
    setSelectedArticleReview(review);
    
    const { data } = await supabase
      .from("articles")
      .select("content")
      .eq("id", review.article_id)
      .single();
    
    setArticleContent(data?.content || "No content available");

    if (review.status === "pending") {
      await supabase
        .from("article_reviews")
        .update({ status: "in_progress" })
        .eq("id", review.id);
      fetchMyArticleReviews();
    }
  };

  const handleViewSubmission = async (review: SubmissionReview) => {
    setSelectedSubmissionReview(review);
    
    const { data } = await supabase
      .from("submissions")
      .select("abstract, keywords, category")
      .eq("id", review.submission_id)
      .single();
    
    setSubmissionContent({
      abstract: data?.abstract || "",
      keywords: data?.keywords || "",
      category: data?.category || "",
    });

    if (review.status === "pending") {
      await supabase
        .from("submission_reviews")
        .update({ status: "in_progress" })
        .eq("id", review.id);
      fetchMySubmissionReviews();
    }
  };

  const handleStartArticleReview = (review: Review) => {
    setSelectedArticleReview(review);
    setReviewType("article");
    setIsReviewDialogOpen(true);
    setRecommendation("");
    setFeedback("");
    setPrivateNotes("");
  };

  const handleStartSubmissionReview = (review: SubmissionReview) => {
    setSelectedSubmissionReview(review);
    setReviewType("submission");
    setIsReviewDialogOpen(true);
    setRecommendation("");
    setFeedback("");
    setPrivateNotes("");
  };

  const handleSubmitReview = async () => {
    if (!recommendation) {
      toast.error("Please select a recommendation");
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (reviewType === "article" && selectedArticleReview) {
      success = await submitArticleReview(
        selectedArticleReview.id,
        recommendation,
        feedback,
        privateNotes
      );
      if (success) fetchMyArticleReviews();
    } else if (reviewType === "submission" && selectedSubmissionReview) {
      success = await submitSubmissionReview(
        selectedSubmissionReview.id,
        recommendation,
        feedback,
        privateNotes
      );
      if (success) fetchMySubmissionReviews();
    }

    if (success) {
      setIsReviewDialogOpen(false);
      setSelectedArticleReview(null);
      setSelectedSubmissionReview(null);
    }
    setIsSubmitting(false);
  };

  if (authLoading || roleLoading || articleReviewsLoading || submissionReviewsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isReviewer) {
    return null;
  }

  const pendingArticleReviews = articleReviews.filter((r) => r.status === "pending" || r.status === "in_progress");
  const completedArticleReviews = articleReviews.filter((r) => r.status === "completed");
  const pendingSubmissionReviews = submissionReviews.filter((r) => r.status === "pending" || r.status === "in_progress");
  const completedSubmissionReviews = submissionReviews.filter((r) => r.status === "completed");

  const totalPending = pendingArticleReviews.length + pendingSubmissionReviews.length;
  const totalCompleted = completedArticleReviews.length + completedSubmissionReviews.length;
  const totalAssigned = articleReviews.length + submissionReviews.length;

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
              <CardTitle className="text-3xl">{totalPending}</CardTitle>
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
              <CardTitle className="text-3xl">{totalCompleted}</CardTitle>
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
              <CardTitle className="text-3xl">{totalAssigned}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                All time
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions" className="gap-2">
              <Inbox className="h-4 w-4" />
              Submissions ({submissionReviews.length})
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              Articles ({articleReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold mb-4">Pending Submission Reviews</h2>
              {pendingSubmissionReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pending submission reviews. Check back later!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingSubmissionReviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{review.submission_title}</CardTitle>
                            <CardDescription className="mt-1">
                              {review.submission_abstract?.slice(0, 150)}
                              {(review.submission_abstract?.length || 0) > 150 ? "..." : ""}
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
                            <Button variant="outline" size="sm" onClick={() => handleViewSubmission(review)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" onClick={() => handleStartSubmissionReview(review)}>
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

            {completedSubmissionReviews.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Completed Submission Reviews</h2>
                <div className="grid gap-4">
                  {completedSubmissionReviews.map((review) => (
                    <Card key={review.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{review.submission_title}</CardTitle>
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
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold mb-4">Pending Article Reviews</h2>
              {pendingArticleReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pending article reviews. Check back later!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingArticleReviews.map((review) => (
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
                            <Button size="sm" onClick={() => handleStartArticleReview(review)}>
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

            {completedArticleReviews.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Completed Article Reviews</h2>
                <div className="grid gap-4">
                  {completedArticleReviews.map((review) => (
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
          </TabsContent>
        </Tabs>
      </main>

      {/* View Article Dialog */}
      <Dialog open={!!selectedArticleReview && !isReviewDialogOpen} onOpenChange={() => setSelectedArticleReview(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticleReview?.article_title}</DialogTitle>
            <DialogDescription>
              Single-blind review - Author information hidden
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Abstract</h3>
              <p className="text-sm text-muted-foreground">{selectedArticleReview?.article_abstract}</p>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(articleContent, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'hr', 'div', 'span'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'rel']
                })
              }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedArticleReview(null)}>
              Close
            </Button>
            <Button onClick={() => selectedArticleReview && handleStartArticleReview(selectedArticleReview)}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={!!selectedSubmissionReview && !isReviewDialogOpen} onOpenChange={() => setSelectedSubmissionReview(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSubmissionReview?.submission_title}</DialogTitle>
            <DialogDescription>
              Single-blind review - Author information hidden
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {submissionContent.category && (
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <Badge variant="secondary">{submissionContent.category}</Badge>
              </div>
            )}
            {submissionContent.keywords && (
              <div>
                <h3 className="font-medium mb-1">Keywords</h3>
                <p className="text-sm text-muted-foreground">{submissionContent.keywords}</p>
              </div>
            )}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Abstract</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submissionContent.abstract}</p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Note: For submissions, reviewers evaluate based on the abstract and metadata. 
              Full manuscript access is provided separately.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubmissionReview(null)}>
              Close
            </Button>
            <Button onClick={() => selectedSubmissionReview && handleStartSubmissionReview(selectedSubmissionReview)}>
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
              Provide your assessment for: {reviewType === "article" ? selectedArticleReview?.article_title : selectedSubmissionReview?.submission_title}
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
