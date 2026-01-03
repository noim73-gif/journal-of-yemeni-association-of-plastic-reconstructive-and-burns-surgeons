import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export function useArticleLikes(articleId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLikes = useCallback(async () => {
    const { count, error } = await supabase
      .from("article_likes")
      .select("*", { count: "exact", head: true })
      .eq("article_id", articleId);

    if (!error) {
      setLikesCount(count || 0);
    }

    if (user) {
      const { data } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsLiked(!!data);
    }

    setLoading(false);
  }, [articleId, user]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like articles",
      });
      return;
    }

    if (isLiked) {
      const { error } = await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", user.id);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to unlike" });
      } else {
        setIsLiked(false);
        setLikesCount((c) => c - 1);
      }
    } else {
      const { error } = await supabase
        .from("article_likes")
        .insert({ article_id: articleId, user_id: user.id });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to like" });
      } else {
        setIsLiked(true);
        setLikesCount((c) => c + 1);
      }
    }
  };

  return { likesCount, isLiked, loading, toggleLike };
}
