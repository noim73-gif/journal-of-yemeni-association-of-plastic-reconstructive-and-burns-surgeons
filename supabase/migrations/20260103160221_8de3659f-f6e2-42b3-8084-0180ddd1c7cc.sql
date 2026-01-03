-- Create article_likes table
CREATE TABLE public.article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (article_id, user_id)
);

-- Enable RLS on article_likes
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_likes
CREATE POLICY "Anyone can view article likes"
ON public.article_likes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like articles"
ON public.article_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
ON public.article_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create article_comments table
CREATE TABLE public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on article_comments
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_comments
CREATE POLICY "Anyone can view comments"
ON public.article_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add comments"
ON public.article_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.article_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.article_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update updated_at for comments
CREATE TRIGGER update_article_comments_updated_at
BEFORE UPDATE ON public.article_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();