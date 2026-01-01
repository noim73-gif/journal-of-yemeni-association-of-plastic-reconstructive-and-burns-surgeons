import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ReadingHistoryItem {
  id: string;
  article_id: string;
  article_title: string;
  article_authors: string | null;
  article_image: string | null;
  read_at: string;
  read_duration_seconds: number | null;
}

export function useReadingHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("reading_history")
      .select("*")
      .order("read_at", { ascending: false });

    if (error) {
      console.error("Error fetching reading history:", error);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  const addToHistory = async (article: {
    id: string;
    title: string;
    authors?: string;
    image?: string;
  }) => {
    if (!user) return;

    // Upsert - update read_at if already exists
    const { error } = await supabase
      .from("reading_history")
      .upsert(
        {
          user_id: user.id,
          article_id: article.id,
          article_title: article.title,
          article_authors: article.authors || null,
          article_image: article.image || null,
          read_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,article_id",
        }
      );

    if (error) {
      console.error("Error adding to reading history:", error);
    } else {
      fetchHistory();
    }
  };

  return {
    history,
    loading,
    addToHistory,
    refetch: fetchHistory,
  };
}
