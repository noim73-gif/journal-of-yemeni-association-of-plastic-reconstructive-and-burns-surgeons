import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Article {
  id: string;
  title: string;
  abstract: string | null;
  content: string | null;
  authors: string | null;
  category: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_main_featured: boolean;
  volume: string | null;
  issue: string | null;
  doi: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ArticleInput {
  title: string;
  abstract?: string;
  content?: string;
  authors?: string;
  category?: string;
  image_url?: string;
  is_featured?: boolean;
  is_main_featured?: boolean;
  volume?: string;
  issue?: string;
  published_at?: string | null;
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch articles",
      });
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const createArticle = async (article: ArticleInput) => {
    const { data, error } = await supabase
      .from("articles")
      .insert(article)
      .select()
      .single();

    if (error) {
      console.error("Error creating article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create article",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Article created successfully",
    });
    await fetchArticles();
    return data;
  };

  const updateArticle = async (id: string, article: ArticleInput) => {
    const { data, error } = await supabase
      .from("articles")
      .update(article)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update article",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Article updated successfully",
    });
    await fetchArticles();
    return data;
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      console.error("Error deleting article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete article",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Article deleted successfully",
    });
    await fetchArticles();
    return true;
  };

  const publishArticle = async (id: string) => {
    const { error } = await supabase
      .from("articles")
      .update({ published_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error publishing article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish article",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Article published successfully",
    });
    await fetchArticles();
    return true;
  };

  const unpublishArticle = async (id: string) => {
    const { error } = await supabase
      .from("articles")
      .update({ published_at: null })
      .eq("id", id);

    if (error) {
      console.error("Error unpublishing article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unpublish article",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Article unpublished successfully",
    });
    await fetchArticles();
    return true;
  };

  return {
    articles,
    loading,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
  };
}

export function usePublishedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublishedArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching published articles:", error);
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    }

    fetchPublishedArticles();
  }, []);

  return { articles, loading };
}
