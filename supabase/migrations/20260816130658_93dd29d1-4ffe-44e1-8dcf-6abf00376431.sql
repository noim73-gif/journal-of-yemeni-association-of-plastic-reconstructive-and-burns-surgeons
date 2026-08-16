ALTER TABLE public.submission_reviews
  ADD COLUMN IF NOT EXISTS round integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'peer_review',
  ADD COLUMN IF NOT EXISTS due_at timestamptz,
  ADD COLUMN IF NOT EXISTS rating_originality smallint,
  ADD COLUMN IF NOT EXISTS rating_methodology smallint,
  ADD COLUMN IF NOT EXISTS rating_clarity smallint,
  ADD COLUMN IF NOT EXISTS rating_significance smallint,
  ADD COLUMN IF NOT EXISTS rating_ethics smallint,
  ADD COLUMN IF NOT EXISTS confidence smallint,
  ADD COLUMN IF NOT EXISTS competing_interests text,
  ADD COLUMN IF NOT EXISTS comments_to_editor text,
  ADD COLUMN IF NOT EXISTS decline_reason text;

ALTER TABLE public.submission_reviews
  ADD CONSTRAINT submission_reviews_ratings_range CHECK (
    (rating_originality IS NULL OR rating_originality BETWEEN 1 AND 5)
    AND (rating_methodology IS NULL OR rating_methodology BETWEEN 1 AND 5)
    AND (rating_clarity IS NULL OR rating_clarity BETWEEN 1 AND 5)
    AND (rating_significance IS NULL OR rating_significance BETWEEN 1 AND 5)
    AND (rating_ethics IS NULL OR rating_ethics BETWEEN 1 AND 5)
    AND (confidence IS NULL OR confidence BETWEEN 1 AND 5)
  );

CREATE UNIQUE INDEX IF NOT EXISTS submission_reviews_unique_round
  ON public.submission_reviews (submission_id, reviewer_id, round);

DROP POLICY IF EXISTS "Reviewers can update their own reviews" ON public.submission_reviews;
CREATE POLICY "Reviewers can update their own reviews"
  ON public.submission_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);