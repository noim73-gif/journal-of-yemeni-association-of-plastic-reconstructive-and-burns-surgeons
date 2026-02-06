-- Create enum for application status
CREATE TYPE public.reviewer_application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Create reviewer applications table
CREATE TABLE public.reviewer_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT NOT NULL,
  department TEXT,
  academic_title TEXT NOT NULL,
  orcid_id TEXT,
  google_scholar_id TEXT,
  publications_count INTEGER DEFAULT 0,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  previous_review_experience TEXT,
  motivation TEXT,
  agreed_to_guidelines BOOLEAN NOT NULL DEFAULT false,
  agreed_to_confidentiality BOOLEAN NOT NULL DEFAULT false,
  status reviewer_application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviewer_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (authenticated or not for initial submission)
CREATE POLICY "Anyone can submit applications"
ON public.reviewer_applications
FOR INSERT
WITH CHECK (true);

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
ON public.reviewer_applications
FOR SELECT
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Admins can manage all applications
CREATE POLICY "Admins can manage all applications"
ON public.reviewer_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_reviewer_applications_updated_at
BEFORE UPDATE ON public.reviewer_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();