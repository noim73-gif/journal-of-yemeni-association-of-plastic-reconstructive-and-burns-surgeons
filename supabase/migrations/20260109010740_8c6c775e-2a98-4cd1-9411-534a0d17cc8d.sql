-- Allow reviewers to view submissions they are assigned to review
CREATE POLICY "Reviewers can view assigned submissions"
ON public.submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.submission_reviews sr
    WHERE sr.submission_id = submissions.id
    AND sr.reviewer_id = auth.uid()
  )
);