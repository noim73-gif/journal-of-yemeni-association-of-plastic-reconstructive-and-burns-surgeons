import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { logger } from "@/lib/logger";

interface SavedArticle {
  id: string;
  article_id: string;
  article_title: string;
  article_authors: string | null;
  article_image: string | null;
  saved_at: string;
}

export function useSavedArticles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    } else {
      setSavedArticles([]);
    }
  }, [user]);

  const fetchSavedArticles = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_articles")
      .select("*")
      .order("saved_at", { ascending: false });

    if (error) {
      logger.error("Error fetching saved articles:", error);
    } else {
      setSavedArticles(data || []);
    }
    setLoading(false);
  };

  const isArticleSaved = (articleId: string) => {
    return savedArticles.some((a) => a.article_id === articleId);
  };

  const saveArticle = async (article: {
    id: string;
    title: string;
    authors?: string;
    image?: string;
  }) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save articles.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("saved_articles").insert({
      user_id: user.id,
      article_id: article.id,
      article_title: article.title,
      article_authors: article.authors || null,
      article_image: article.image || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already saved",
          description: "This article is already in your saved list.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save article.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Saved",
        description: "Article added to your saved list.",
      });
      fetchSavedArticles();
    }
  };

  const unsaveArticle = async (articleId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("saved_articles")
      .delete()
      .eq("user_id", user.id)
      .eq("article_id", articleId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove article.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed",
        description: "Article removed from your saved list.",
      });
      fetchSavedArticles();
    }
  };

  return {
    savedArticles,
    loading,
    isArticleSaved,
    saveArticle,
    unsaveArticle,
    refetch: fetchSavedArticles,
  };
}
