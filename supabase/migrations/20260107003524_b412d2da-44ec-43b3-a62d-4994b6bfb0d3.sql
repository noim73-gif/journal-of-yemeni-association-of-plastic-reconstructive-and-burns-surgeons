-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  authors TEXT NOT NULL,
  keywords TEXT,
  category TEXT,
  cover_letter TEXT,
  manuscript_url TEXT,
  supplementary_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create submissions
CREATE POLICY "Users can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their pending submissions
CREATE POLICY "Users can update pending submissions"
ON public.submissions
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can manage all submissions
CREATE POLICY "Admins can manage all submissions"
ON public.submissions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for manuscripts
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscripts', 'manuscripts', false);

-- Storage policies for manuscripts
CREATE POLICY "Users can upload manuscripts"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own manuscripts"
ON storage.objects
FOR SELECT
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all manuscripts"
ON storage.objects
FOR SELECT
USING (bucket_id = 'manuscripts' AND has_role(auth.uid(), 'admin'));