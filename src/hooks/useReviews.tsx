import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Review {
  id: string;
  article_id: string;
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
  article_title?: string;
  article_abstract?: string;
  reviewer_name?: string;
}

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("article_reviews")
      .select("*")
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    // Fetch article titles for each review
    const articleIds = [...new Set((data || []).map((r) => r.article_id))];
    const { data: articles } = await supabase
      .from("articles")
      .select("id, title, abstract")
      .in("id", articleIds);

    // Fetch reviewer names
    const reviewerIds = [...new Set((data || []).map((r) => r.reviewer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", reviewerIds);

    const reviewsWithDetails = (data || []).map((review) => {
      const article = articles?.find((a) => a.id === review.article_id);
      const profile = profiles?.find((p) => p.user_id === review.reviewer_id);
      return {
        ...review,
        article_title: article?.title || "Unknown Article",
        article_abstract: article?.abstract || "",
        reviewer_name: profile?.full_name || "Unknown Reviewer",
      } as Review;
    });

    setReviews(reviewsWithDetails);
    setLoading(false);
  }

  async function fetchMyReviews() {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("article_reviews")
      .select("*")
      .eq("reviewer_id", user.id)
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error fetching my reviews:", error);
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    // Fetch article details (excluding author info for single-blind)
    const articleIds = [...new Set((data || []).map((r) => r.article_id))];
    const { data: articles } = await supabase
      .from("articles")
      .select("id, title, abstract, content, category")
      .in("id", articleIds);

    const reviewsWithDetails = (data || []).map((review) => {
      const article = articles?.find((a) => a.id === review.article_id);
      return {
        ...review,
        article_title: article?.title || "Unknown Article",
        article_abstract: article?.abstract || "",
      } as Review;
    });

    setReviews(reviewsWithDetails);
    setLoading(false);
  }

  async function assignReviewer(articleId: string, reviewerId: string) {
    const { error } = await supabase
      .from("article_reviews")
      .insert([{ article_id: articleId, reviewer_id: reviewerId }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("Reviewer is already assigned to this article");
      } else {
        console.error("Error assigning reviewer:", error);
        toast.error("Failed to assign reviewer");
      }
      return false;
    }

    // Update article review status
    await supabase
      .from("articles")
      .update({ review_status: "under_review" })
      .eq("id", articleId);

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
      .from("article_reviews")
      .update({
        status: "completed",
        recommendation,
        feedback,
        private_notes: privateNotes,
        completed_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
      return false;
    }

    toast.success("Review submitted successfully");
    return true;
  }

  async function updateReviewStatus(reviewId: string, status: string) {
    const { error } = await supabase
      .from("article_reviews")
      .update({ status })
      .eq("id", reviewId);

    if (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update status");
      return false;
    }

    toast.success("Status updated");
    await fetchReviews();
    return true;
  }

  async function removeReviewer(reviewId: string) {
    const { error } = await supabase
      .from("article_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("Error removing reviewer:", error);
      toast.error("Failed to remove reviewer");
      return false;
    }

    toast.success("Reviewer removed");
    await fetchReviews();
    return true;
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
  };
}

export function useIsReviewer() {
  const { user } = useAuth();
  const [isReviewer, setIsReviewer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkReviewerRole() {
      if (!user) {
        setIsReviewer(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "reviewer")
        .maybeSingle();

      if (error) {
        console.error("Error checking reviewer role:", error);
        setIsReviewer(false);
      } else {
        setIsReviewer(!!data);
      }
      setLoading(false);
    }

    checkReviewerRole();
  }, [user]);

  return { isReviewer, loading };
}
