import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { logger } from "@/lib/logger";

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

export function useArticleComments(articleId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching comments:", error);
    } else {
      // Fetch user profiles for comments
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      setComments(
        data.map((c) => ({
          ...c,
          user_name: profileMap.get(c.user_id) || "Anonymous",
        }))
      );
    }
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
      });
      return null;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("article_comments")
      .insert({ article_id: articleId, user_id: user.id, content: content.trim() })
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add comment" });
      return null;
    }

    toast({ title: "Success", description: "Comment added" });
    await fetchComments();
    return data;
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("article_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete comment" });
      return false;
    }

    toast({ title: "Success", description: "Comment deleted" });
    await fetchComments();
    return true;
  };

  return { comments, loading, addComment, deleteComment };
}
