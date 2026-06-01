DROP POLICY IF EXISTS "Users can update pending submissions" ON public.submissions;

CREATE POLICY "Users can update own draft or pending submissions"
ON public.submissions
FOR UPDATE
USING (auth.uid() = user_id AND status IN ('draft', 'pending'));

CREATE INDEX IF NOT EXISTS idx_submissions_user_draft
ON public.submissions (user_id, status, updated_at DESC);