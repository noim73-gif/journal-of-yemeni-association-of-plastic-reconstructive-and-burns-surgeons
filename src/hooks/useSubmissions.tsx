import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Submission {
  id: string;
  user_id: string;
  title: string;
  abstract: string;
  authors: string;
  keywords: string | null;
  category: string | null;
  cover_letter: string | null;
  manuscript_url: string | null;
  supplementary_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionInput {
  title: string;
  abstract: string;
  authors: string;
  keywords?: string;
  category?: string;
  cover_letter?: string;
  manuscript_url?: string;
  supplementary_url?: string;
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const createSubmission = async (input: SubmissionInput) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        ...input,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create submission",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Manuscript submitted successfully",
    });

    // Send email notification (non-blocking)
    try {
      await supabase.functions.invoke("send-submission-notification", {
        body: {
          submissionId: data.id,
          title: data.title,
          authors: data.authors,
          category: data.category,
          submitterEmail: user.email,
          submitterName: user.user_metadata?.full_name || null,
        },
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the submission if email fails
    }
    
    await fetchSubmissions();
    return data;
  };

  const updateSubmission = async (id: string, input: Partial<SubmissionInput>) => {
    const { error } = await supabase
      .from("submissions")
      .update(input)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Submission updated successfully",
    });
    
    await fetchSubmissions();
    return true;
  };

  const updateSubmissionStatus = async (id: string, status: string, admin_notes?: string) => {
    const { error } = await supabase
      .from("submissions")
      .update({ status, admin_notes })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Submission status updated",
    });
    
    await fetchSubmissions();
    return true;
  };

  const uploadManuscript = async (file: File, type: 'manuscript' | 'supplementary') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("manuscripts")
      .upload(fileName, file);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive",
      });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("manuscripts")
      .getPublicUrl(fileName);

    return fileName;
  };

  const getManuscriptUrl = async (path: string) => {
    const { data } = await supabase.storage
      .from("manuscripts")
      .createSignedUrl(path, 3600);

    return data?.signedUrl || null;
  };

  return {
    submissions,
    loading,
    createSubmission,
    updateSubmission,
    updateSubmissionStatus,
    uploadManuscript,
    getManuscriptUrl,
    refetch: fetchSubmissions,
  };
}
