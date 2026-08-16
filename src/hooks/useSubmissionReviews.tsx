import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import type { ReviewReport } from "@/lib/reviewForm";

export interface SubmissionReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  status: "pending" | "in_progress" | "completed" | "declined";
  recommendation: "accept" | "minor_revisions" | "major_revisions" | "reject" | null;
  feedback: string | null;
  private_notes: string | null;
  assigned_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  round: number;
  stage: string;
  due_at: string | null;
  rating_originality: number | null;
  rating_methodology: number | null;
  rating_clarity: number | null;
  rating_significance: number | null;
  rating_ethics: number | null;
  confidence: number | null;
  competing_interests: string | null;
  comments_to_editor: string | null;
  decline_reason: string | null;
  // Joined data
  submission_title?: string;
  submission_abstract?: string;
  reviewer_name?: string;
}

function reportToRow(report: ReviewReport) {
  return {
    recommendation: report.recommendation || null,
    feedback: report.feedback || null,
    private_notes: report.private_notes || null,
    comments_to_editor: report.comments_to_editor || null,
    competing_interests: report.competing_interests || null,
    confidence: report.confidence,
    rating_originality: report.rating_originality,
    rating_methodology: report.rating_methodology,
    rating_clarity: report.rating_clarity,
    rating_significance: report.rating_significance,
    rating_ethics: report.rating_ethics,
  };
}

export function useSubmissionReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<SubmissionReview[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("submission_reviews")
      .select("*")
      .order("assigned_at", { ascending: false });

    if (error) {
      logger.error("Error fetching submission reviews:", error);
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    // Fetch submission details
    const submissionIds = [...new Set((data || []).map((r) => r.submission_id))];
    const { data: submissions } = await supabase
      .from("submissions")
      .select("id, title, abstract")
      .in("id", submissionIds);

    // Fetch reviewer names
    const reviewerIds = [...new Set((data || []).map((r) => r.reviewer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", reviewerIds);

    const reviewsWithDetails = (data || []).map((review) => {
      const submission = submissions?.find((s) => s.id === review.submission_id);
      const profile = profiles?.find((p) => p.user_id === review.reviewer_id);
      return {
        ...review,
        submission_title: submission?.title || "Unknown Submission",
        submission_abstract: submission?.abstract || "",
        reviewer_name: profile?.full_name || "Unknown Reviewer",
      } as SubmissionReview;
    });

    setReviews(reviewsWithDetails);
    setLoading(false);
  }

  async function fetchMyReviews() {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("submission_reviews")
      .select("*")
      .eq("reviewer_id", user.id)
      .order("assigned_at", { ascending: false });

    if (error) {
      logger.error("Error fetching my submission reviews:", error);
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    // Fetch submission details (excluding author info for single-blind)
    const submissionIds = [...new Set((data || []).map((r) => r.submission_id))];
    const { data: submissions } = await supabase
      .from("submissions")
      .select("id, title, abstract, category, keywords")
      .in("id", submissionIds);

    const reviewsWithDetails = (data || []).map((review) => {
      const submission = submissions?.find((s) => s.id === review.submission_id);
      return {
        ...review,
        submission_title: submission?.title || "Unknown Submission",
        submission_abstract: submission?.abstract || "",
      } as SubmissionReview;
    });

    setReviews(reviewsWithDetails);
    setLoading(false);
  }

  async function assignReviewer(
    submissionId: string,
    reviewerId: string,
    options?: { round?: number; stage?: string; dueAt?: string | null }
  ) {
    const { error } = await supabase
      .from("submission_reviews")
      .insert([
        {
          submission_id: submissionId,
          reviewer_id: reviewerId,
          round: options?.round ?? 1,
          stage: options?.stage ?? "peer_review",
          due_at: options?.dueAt ?? null,
        },
      ]);

    if (error) {
      if (error.code === "23505" || error.code === "23514" || error.code === "23P01") {
        toast.error("Reviewer is already assigned to this submission");
      } else {
        logger.error("Error assigning reviewer:", error);
        toast.error("Failed to assign reviewer");
      }
      return false;
    }

    // Update submission status to under_review
    await supabase
      .from("submissions")
      .update({ status: "under_review" })
      .eq("id", submissionId);

    toast.success("Reviewer assigned successfully");
    await fetchReviews();
    return true;
  }

  /** Save an in-progress report without filing it. */
  async function saveReviewDraft(reviewId: string, report: ReviewReport) {
    const { error } = await supabase
      .from("submission_reviews")
      .update({ ...reportToRow(report), status: "in_progress" })
      .eq("id", reviewId);

    if (error) {
      logger.error("Error saving review draft:", error);
      toast.error("Failed to save your progress");
      return false;
    }

    toast.success("Progress saved");
    return true;
  }

  async function submitReview(reviewId: string, report: ReviewReport) {
    const { data, error } = await supabase
      .from("submission_reviews")
      .update({
        ...reportToRow(report),
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", reviewId);
      .select("submission_id, round, stage, recommendation")
      .maybeSingle();

    if (error) {
      logger.error("Error submitting review:", error);
      toast.error("Failed to submit review");
      return false;
    }

    if (data) {
      await supabase.from("submission_audit_log").insert({
        submission_id: data.submission_id,
        actor_id: user?.id ?? null,
        actor_role: "reviewer",
        action: "review_submitted",
        to_value: data.recommendation,
        details: { round: data.round, stage: data.stage },
      });
    }

    toast.success("Review submitted successfully");
    return true;
  }

  async function declineReview(reviewId: string, reason: string) {
    const { error } = await supabase
      .from("submission_reviews")
      .update({ status: "declined", decline_reason: reason || null })
      .eq("id", reviewId);

    if (error) {
      logger.error("Error declining review invitation:", error);
      toast.error("Failed to decline the invitation");
      return false;
    }

    toast.success("Invitation declined");
    return true;
  }

  async function updateReviewStatus(reviewId: string, status: string) {
    const { error } = await supabase
      .from("submission_reviews")
      .update({ status })
      .eq("id", reviewId);

    if (error) {
      logger.error("Error updating review status:", error);
      toast.error("Failed to update status");
      return false;
    }

    toast.success("Status updated");
    await fetchReviews();
    return true;
  }

  async function removeReviewer(reviewId: string) {
    const { error } = await supabase
      .from("submission_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      logger.error("Error removing reviewer:", error);
      toast.error("Failed to remove reviewer");
      return false;
    }

    toast.success("Reviewer removed");
    await fetchReviews();
    return true;
  }

  async function getReviewsForSubmission(submissionId: string) {
    const { data, error } = await supabase
      .from("submission_reviews")
      .select("*")
      .eq("submission_id", submissionId)
      .order("assigned_at", { ascending: false });

    if (error) {
      logger.error("Error fetching reviews for submission:", error);
      return [];
    }

    // Fetch reviewer names
    const reviewerIds = [...new Set((data || []).map((r) => r.reviewer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", reviewerIds);

    return (data || []).map((review) => {
      const profile = profiles?.find((p) => p.user_id === review.reviewer_id);
      return {
        ...review,
        reviewer_name: profile?.full_name || "Unknown Reviewer",
      } as SubmissionReview;
    });
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    refetch: fetchReviews,
    fetchMyReviews,
    assignReviewer,
    submitReview,
    saveReviewDraft,
    declineReview,
    updateReviewStatus,
    removeReviewer,
    getReviewsForSubmission,
  };
}
