import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export type WorkflowStage = "submission" | "review" | "copyediting" | "production" | "publication";
export type ReviewType = "single_blind" | "double_blind" | "open";
export type Decision = "accept" | "minor_revisions" | "major_revisions" | "reject" | "pending";

export interface WorkflowSubmission {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  user_id: string;
  status: string;
  workflow_stage: WorkflowStage;
  review_type: ReviewType;
  editor_id: string | null;
  section_editor_id: string | null;
  copyeditor_id: string | null;
  layout_editor_id: string | null;
  journal_issue_id: string | null;
  decision: Decision | null;
  decision_date: string | null;
  revision_number: number;
  category: string | null;
  keywords: string | null;
  manuscript_url: string | null;
  cover_letter: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
  // Joined
  author_name?: string;
  editor_name?: string;
  review_count?: number;
}

export interface EditorialDecision {
  id: string;
  submission_id: string;
  editor_id: string;
  decision: string;
  stage: WorkflowStage;
  comments: string | null;
  notify_author: boolean;
  created_at: string;
}

export interface SubmissionFile {
  id: string;
  submission_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  version: number;
  stage: WorkflowStage;
  uploaded_by: string;
  notes: string | null;
  created_at: string;
}

export function useEditorialWorkflow() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<WorkflowSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async (stage?: WorkflowStage) => {
    setLoading(true);
    let query = supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (stage) {
      query = query.eq("workflow_stage", stage);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Error fetching workflow submissions:", error);
      toast.error("Failed to load submissions");
      setLoading(false);
      return;
    }

    // Fetch author names
    const userIds = [...new Set((data || []).map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    // Fetch review counts
    const submissionIds = (data || []).map((s) => s.id);
    const { data: reviews } = await supabase
      .from("submission_reviews")
      .select("submission_id")
      .in("submission_id", submissionIds);

    const reviewCounts: Record<string, number> = {};
    (reviews || []).forEach((r) => {
      reviewCounts[r.submission_id] = (reviewCounts[r.submission_id] || 0) + 1;
    });

    const enriched = (data || []).map((s) => {
      const profile = profiles?.find((p) => p.user_id === s.user_id);
      return {
        ...s,
        workflow_stage: (s.workflow_stage || "submission") as WorkflowStage,
        review_type: (s.review_type || "double_blind") as ReviewType,
        decision: s.decision as Decision | null,
        revision_number: s.revision_number || 1,
        metadata: (s.metadata || {}) as Record<string, unknown>,
        author_name: profile?.full_name || "Unknown",
        review_count: reviewCounts[s.id] || 0,
      } as WorkflowSubmission;
    });

    setSubmissions(enriched);
    setLoading(false);
  }, []);

  async function advanceStage(submissionId: string, newStage: WorkflowStage, decision?: string, comments?: string) {
    if (!user) return false;

    // Record editorial decision
    const { error: decisionError } = await supabase.from("editorial_decisions").insert([
      {
        submission_id: submissionId,
        editor_id: user.id,
        decision: decision || `send_to_${newStage}`,
        stage: newStage,
        comments: comments || null,
        notify_author: true,
      },
    ]);

    if (decisionError) {
      logger.error("Error recording decision:", decisionError);
    }

    // Update submission stage
    const updates: Record<string, unknown> = { workflow_stage: newStage };
    if (decision) updates.decision = decision;
    if (decision) updates.decision_date = new Date().toISOString();

    // Map workflow stage to submission status
    const statusMap: Record<string, string> = {
      submission: "pending",
      review: "under_review",
      copyediting: "accepted",
      production: "accepted",
      publication: "published",
    };
    updates.status = statusMap[newStage] || "pending";

    const { error } = await supabase.from("submissions").update(updates).eq("id", submissionId);

    if (error) {
      logger.error("Error advancing stage:", error);
      toast.error("Failed to advance workflow stage");
      return false;
    }

    toast.success(`Submission moved to ${newStage} stage`);
    await fetchSubmissions();
    return true;
  }

  async function assignEditor(submissionId: string, editorId: string, role: "editor" | "section_editor" | "copyeditor" | "layout_editor") {
    const columnMap = {
      editor: "editor_id",
      section_editor: "section_editor_id",
      copyeditor: "copyeditor_id",
      layout_editor: "layout_editor_id",
    };

    const { error } = await supabase
      .from("submissions")
      .update({ [columnMap[role]]: editorId })
      .eq("id", submissionId);

    if (error) {
      logger.error("Error assigning editor:", error);
      toast.error("Failed to assign editor");
      return false;
    }

    toast.success(`${role.replace("_", " ")} assigned`);
    await fetchSubmissions();
    return true;
  }

  async function makeDecision(submissionId: string, decision: Decision, comments?: string) {
    if (!user) return false;

    const { error } = await supabase
      .from("submissions")
      .update({
        decision,
        decision_date: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (error) {
      logger.error("Error making decision:", error);
      toast.error("Failed to record decision");
      return false;
    }

    await supabase.from("editorial_decisions").insert([
      {
        submission_id: submissionId,
        editor_id: user.id,
        decision,
        stage: "review",
        comments: comments || null,
      },
    ]);

    toast.success("Decision recorded");
    await fetchSubmissions();
    return true;
  }

  async function fetchDecisionLog(submissionId: string): Promise<EditorialDecision[]> {
    const { data, error } = await supabase
      .from("editorial_decisions")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: true });

    if (error) {
      logger.error("Error fetching decisions:", error);
      return [];
    }

    return (data || []) as EditorialDecision[];
  }

  async function fetchSubmissionFiles(submissionId: string): Promise<SubmissionFile[]> {
    const { data, error } = await supabase
      .from("submission_files")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching files:", error);
      return [];
    }

    return (data || []) as SubmissionFile[];
  }

  async function setReviewType(submissionId: string, reviewType: ReviewType) {
    const { error } = await supabase
      .from("submissions")
      .update({ review_type: reviewType })
      .eq("id", submissionId);

    if (error) {
      logger.error("Error setting review type:", error);
      toast.error("Failed to set review type");
      return false;
    }

    toast.success(`Review type set to ${reviewType.replace("_", " ")}`);
    await fetchSubmissions();
    return true;
  }

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    fetchSubmissions,
    advanceStage,
    assignEditor,
    makeDecision,
    fetchDecisionLog,
    fetchSubmissionFiles,
    setReviewType,
  };
}
