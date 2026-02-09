
-- Fix 1: Remove the overly permissive public policy from doctor_profiles
-- The doctor_profiles_public view already handles safe public access
DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON public.doctor_profiles;

-- Fix 2: Add storage policy for reviewers to access assigned manuscripts
CREATE POLICY "Reviewers can view assigned manuscripts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'manuscripts' AND
  EXISTS (
    SELECT 1 FROM public.submission_reviews sr
    JOIN public.submissions s ON s.id = sr.submission_id
    WHERE sr.reviewer_id = auth.uid()
    AND (s.manuscript_url = name OR s.supplementary_url = name)
  )
);
