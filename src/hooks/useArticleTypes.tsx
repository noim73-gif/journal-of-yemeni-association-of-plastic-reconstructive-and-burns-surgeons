import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface ArticleType {
  id: string;
  code: string;
  label: string;
  description: string | null;
  reporting_guideline: string | null;
  requires_trial_registration: boolean;
  requires_ethics_approval: boolean;
  max_abstract_words: number | null;
  max_word_count: number | null;
  display_order: number;
  is_active: boolean;
}

export function useArticleTypes() {
  const [types, setTypes] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    const { data, error } = await supabase
      .from("article_types")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (error) logger.error("Failed to load article types", error);
    setTypes((data as ArticleType[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchTypes();
  }, []);

  return { types, loading, refetch: fetchTypes };
}
