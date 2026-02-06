import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

export interface ReviewerApplication {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  institution: string;
  department: string | null;
  academic_title: string;
  orcid_id: string | null;
  google_scholar_id: string | null;
  publications_count: number;
  expertise_areas: string[];
  previous_review_experience: string | null;
  motivation: string | null;
  agreed_to_guidelines: boolean;
  agreed_to_confidentiality: boolean;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationInput {
  full_name: string;
  email: string;
  institution: string;
  department?: string | null;
  academic_title: string;
  orcid_id?: string | null;
  google_scholar_id?: string | null;
  publications_count?: number;
  expertise_areas: string[];
  previous_review_experience?: string | null;
  motivation?: string | null;
  agreed_to_guidelines: boolean;
  agreed_to_confidentiality: boolean;
}

export function useSubmitApplication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: ApplicationInput) => {
      const { data, error } = await supabase
        .from("reviewer_applications")
        .insert({
          ...application,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ReviewerApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewer-applications"] });
      toast.success("Application submitted successfully");
    },
    onError: (error) => {
      toast.error("Failed to submit application: " + error.message);
    },
  });
}

export function useReviewerApplicationsAdmin() {
  return useQuery({
    queryKey: ["reviewer-applications-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviewer_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ReviewerApplication[];
    },
  });
}

export function useUpdateApplicationStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_notes,
    }: {
      id: string;
      status: ApplicationStatus;
      admin_notes?: string;
    }) => {
      const updates: Record<string, unknown> = {
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      };

      if (admin_notes !== undefined) {
        updates.admin_notes = admin_notes;
      }

      const { data, error } = await supabase
        .from("reviewer_applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ReviewerApplication;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviewer-applications-admin"] });
      toast.success(`Application ${data.status === "approved" ? "approved" : data.status === "rejected" ? "rejected" : "updated"}`);
    },
    onError: (error) => {
      toast.error("Failed to update application: " + error.message);
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reviewer_applications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewer-applications-admin"] });
      toast.success("Application deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete application: " + error.message);
    },
  });
}
