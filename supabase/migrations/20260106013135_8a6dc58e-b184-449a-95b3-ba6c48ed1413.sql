-- Add 'reviewer' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reviewer';

-- Create article_reviews table for peer review workflow
CREATE TABLE public.article_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'declined')),
  recommendation TEXT CHECK (recommendation IN ('accept', 'minor_revisions', 'major_revisions', 'reject')),
  feedback TEXT,
  private_notes TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, reviewer_id)
);

-- Add review_status to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'draft' 
CHECK (review_status IN ('draft', 'submitted', 'under_review', 'revision_requested', 'accepted', 'rejected'));

-- Enable RLS
ALTER TABLE public.article_reviews ENABLE ROW LEVEL SECURITY;

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
ON public.article_reviews
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Reviewers can view their assigned reviews (single-blind: they see article but not author identity via this table)
CREATE POLICY "Reviewers can view assigned reviews"
ON public.article_reviews
FOR SELECT
USING (reviewer_id = auth.uid());

-- Reviewers can update their own reviews
CREATE POLICY "Reviewers can update assigned reviews"
ON public.article_reviews
FOR UPDATE
USING (reviewer_id = auth.uid());

-- Create index for performance
CREATE INDEX idx_article_reviews_article_id ON public.article_reviews(article_id);
CREATE INDEX idx_article_reviews_reviewer_id ON public.article_reviews(reviewer_id);
CREATE INDEX idx_articles_review_status ON public.articles(review_status);

-- Trigger for updated_at
CREATE TRIGGER update_article_reviews_updated_at
BEFORE UPDATE ON public.article_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();