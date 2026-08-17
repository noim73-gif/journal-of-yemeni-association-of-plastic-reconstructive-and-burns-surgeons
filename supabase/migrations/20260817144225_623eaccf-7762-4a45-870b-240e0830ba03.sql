ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS submission_doi text,
  ADD COLUMN IF NOT EXISTS permalink_slug text,
  ADD COLUMN IF NOT EXISTS doi_assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS citation_public boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS submissions_submission_doi_key ON public.submissions (submission_doi);
CREATE UNIQUE INDEX IF NOT EXISTS submissions_permalink_slug_key ON public.submissions (permalink_slug);

CREATE OR REPLACE FUNCTION public.assign_submission_identifiers()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  y text;
  short text;
BEGIN
  IF NEW.status IS DISTINCT FROM 'draft' AND NEW.submission_doi IS NULL THEN
    y := to_char(COALESCE(NEW.submitted_at, NEW.created_at, now()), 'YYYY');
    short := left(replace(NEW.id::text, '-', ''), 8);
    NEW.submission_doi := '10.1234/yjprbs.ms.' || y || '.' || short;
    NEW.permalink_slug := 'ms-' || y || '-' || short;
    NEW.doi_assigned_at := now();
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.submission_doi IS NOT NULL THEN
    NEW.submission_doi := OLD.submission_doi;
    NEW.permalink_slug := OLD.permalink_slug;
    NEW.doi_assigned_at := OLD.doi_assigned_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_submission_identifiers_trg ON public.submissions;
CREATE TRIGGER assign_submission_identifiers_trg
BEFORE INSERT OR UPDATE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.assign_submission_identifiers();

UPDATE public.submissions SET updated_at = updated_at WHERE status IS DISTINCT FROM 'draft' AND submission_doi IS NULL;

CREATE OR REPLACE FUNCTION public.get_public_manuscript_record(p_slug text)
RETURNS TABLE (
  permalink_slug text,
  submission_doi text,
  title text,
  authors text,
  abstract text,
  keywords text,
  category text,
  status text,
  workflow_stage text,
  manuscript_language text,
  article_type text,
  submitted_at timestamptz,
  doi_assigned_at timestamptz,
  published_article_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.permalink_slug,
         s.submission_doi,
         s.title,
         s.authors,
         s.abstract,
         s.keywords,
         s.category,
         s.status,
         s.workflow_stage,
         s.manuscript_language,
         t.label,
         s.submitted_at,
         s.doi_assigned_at,
         (SELECT a.id FROM public.articles a WHERE a.submission_id = s.id AND a.published_at IS NOT NULL LIMIT 1)
  FROM public.submissions s
  LEFT JOIN public.article_types t ON t.id = s.article_type_id
  WHERE s.permalink_slug = p_slug
    AND s.status IS DISTINCT FROM 'draft'
    AND s.citation_public = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_manuscript_record(text) TO anon, authenticated;