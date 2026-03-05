import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface JournalIssue {
  id: string;
  volume: number;
  number: number;
  year: number;
  title: string | null;
  description: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  is_current: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  article_count?: number;
}

export interface JournalIssueInput {
  volume: number;
  number: number;
  year: number;
  title?: string;
  description?: string;
  cover_image_url?: string;
  status?: "draft" | "published" | "archived";
  is_current?: boolean;
}

export function useJournalIssues() {
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchIssues() {
    setLoading(true);

    const { data, error } = await supabase
      .from("journal_issues")
      .select("*")
      .order("year", { ascending: false })
      .order("volume", { ascending: false })
      .order("number", { ascending: false });

    if (error) {
      logger.error("Error fetching issues:", error);
      toast.error("Failed to load issues");
      setLoading(false);
      return;
    }

    // Count articles per issue
    const issueIds = (data || []).map((i) => i.id);
    const { data: articles } = await supabase
      .from("articles")
      .select("journal_issue_id")
      .in("journal_issue_id", issueIds.length > 0 ? issueIds : ["none"]);

    const counts: Record<string, number> = {};
    (articles || []).forEach((a) => {
      if (a.journal_issue_id) {
        counts[a.journal_issue_id] = (counts[a.journal_issue_id] || 0) + 1;
      }
    });

    const enriched = (data || []).map((issue) => ({
      ...issue,
      status: issue.status as "draft" | "published" | "archived",
      article_count: counts[issue.id] || 0,
    }));

    setIssues(enriched);
    setLoading(false);
  }

  async function createIssue(input: JournalIssueInput) {
    const { error } = await supabase.from("journal_issues").insert([input]);

    if (error) {
      if (error.code === "23505") {
        toast.error("An issue with this volume/number/year already exists");
      } else {
        logger.error("Error creating issue:", error);
        toast.error("Failed to create issue");
      }
      return false;
    }

    toast.success("Issue created");
    await fetchIssues();
    return true;
  }

  async function updateIssue(id: string, input: Partial<JournalIssueInput>) {
    const { error } = await supabase.from("journal_issues").update(input).eq("id", id);

    if (error) {
      logger.error("Error updating issue:", error);
      toast.error("Failed to update issue");
      return false;
    }

    toast.success("Issue updated");
    await fetchIssues();
    return true;
  }

  async function publishIssue(id: string) {
    const { error } = await supabase
      .from("journal_issues")
      .update({ status: "published", published_at: new Date().toISOString(), is_current: true })
      .eq("id", id);

    if (error) {
      logger.error("Error publishing issue:", error);
      toast.error("Failed to publish issue");
      return false;
    }

    // Unset other issues as current
    await supabase
      .from("journal_issues")
      .update({ is_current: false })
      .neq("id", id);

    toast.success("Issue published");
    await fetchIssues();
    return true;
  }

  async function deleteIssue(id: string) {
    const { error } = await supabase.from("journal_issues").delete().eq("id", id);

    if (error) {
      logger.error("Error deleting issue:", error);
      toast.error("Failed to delete issue");
      return false;
    }

    toast.success("Issue deleted");
    await fetchIssues();
    return true;
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    refetch: fetchIssues,
    createIssue,
    updateIssue,
    publishIssue,
    deleteIssue,
  };
}
