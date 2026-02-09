import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

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
  // Joined data
  submission_title?: string;
  submission_abstract?: string;
  reviewer_name?: string;
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

  async function assignReviewer(submissionId: string, reviewerId: string) {
    const { error } = await supabase
      .from("submission_reviews")
      .insert([{ submission_id: submissionId, reviewer_id: reviewerId }]);

    if (error) {
      if (error.code === "23505") {
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

  async function submitReview(
    reviewId: string,
    recommendation: string,
    feedback: string,
    privateNotes: string
  ) {
    const { error } = await supabase
      .from("submission_reviews")
      .update({
        status: "completed",
        recommendation,
        feedback,
        private_notes: privateNotes,
        completed_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      logger.error("Error submitting review:", error);
      toast.error("Failed to submit review");
      return false;
    }

    toast.success("Review submitted successfully");
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
    updateReviewStatus,
    removeReviewer,
    getReviewsForSubmission,
  };
}
