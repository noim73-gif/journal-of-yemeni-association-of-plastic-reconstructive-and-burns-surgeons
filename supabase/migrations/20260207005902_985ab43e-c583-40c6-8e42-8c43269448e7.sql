-- Fix 1: reviewer_applications - The current SELECT policy is restrictive enough
-- But we should ensure the policy is correct - let's verify and add explicit protection

-- First, let's create a view that excludes the most sensitive data for non-admin access
-- and ensure the SELECT policy is truly restrictive

-- Drop and recreate the SELECT policy to be more explicit
DROP POLICY IF EXISTS "Users can view own applications" ON public.reviewer_applications;

-- Policy for users to view their own applications (authenticated users only)
CREATE POLICY "Users can view own applications"
ON public.reviewer_applications
FOR SELECT
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
);

-- Fix 2: article_comments - Change to require authentication to view comments
-- This prevents anonymous tracking of user activity
DROP POLICY IF EXISTS "Anyone can view comments" ON public.article_comments;

CREATE POLICY "Authenticated users can view comments"
ON public.article_comments
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix 3: doctor_profiles - Create a public view that excludes sensitive credentials
-- First, let's make the SELECT policy for public profiles exclude sensitive fields by using a view

-- Create a public view that excludes sensitive credentials
CREATE OR REPLACE VIEW public.doctor_profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  specialty,
  academic_degree,
  university,
  hospital,
  research_interests,
  spoken_languages,
  years_of_experience,
  is_public_profile,
  created_at,
  updated_at
  -- Excludes: medical_license_number, orcid_id, google_scholar_id
FROM public.doctor_profiles
WHERE is_public_profile = true;

-- Grant access to the view
GRANT SELECT ON public.doctor_profiles_public TO anon, authenticated;