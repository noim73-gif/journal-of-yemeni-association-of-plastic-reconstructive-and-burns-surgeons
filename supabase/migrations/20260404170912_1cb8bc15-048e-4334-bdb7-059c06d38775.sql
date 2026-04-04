-- Add view_count to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- Make article comments publicly readable
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.article_comments;
CREATE POLICY "Anyone can view comments" ON public.article_comments
FOR SELECT USING (true);

-- Function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE articles SET view_count = view_count + 1 WHERE id = article_id;
$$;