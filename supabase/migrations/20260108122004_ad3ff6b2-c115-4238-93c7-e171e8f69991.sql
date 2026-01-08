-- Create submission_reviews table for peer review of submissions
CREATE TABLE public.submission_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  recommendation TEXT,
  feedback TEXT,
  private_notes TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(submission_id, reviewer_id)
);

-- Enable RLS
ALTER TABLE public.submission_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all submission reviews"
ON public.submission_reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Reviewers can view assigned submission reviews"
ON public.submission_reviews
FOR SELECT
USING (reviewer_id = auth.uid());

CREATE POLICY "Reviewers can update assigned submission reviews"
ON public.submission_reviews
FOR UPDATE
USING (reviewer_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_submission_reviews_updated_at
BEFORE UPDATE ON public.submission_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();