CREATE TABLE public.journal_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  mint_draft_identifiers boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.journal_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.journal_settings TO authenticated;
GRANT ALL ON public.journal_settings TO service_role;

ALTER TABLE public.journal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Journal settings are readable by everyone"
  ON public.journal_settings FOR SELECT USING (true);

CREATE POLICY "Admins can insert journal settings"
  ON public.journal_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update journal settings"
  ON public.journal_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_journal_settings_updated_at
  BEFORE UPDATE ON public.journal_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.journal_settings (singleton, mint_draft_identifiers) VALUES (true, false);

CREATE OR REPLACE FUNCTION public.assign_submission_identifiers()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  y text;
  short text;
  mint_drafts boolean := false;
BEGIN
  SELECT js.mint_draft_identifiers INTO mint_drafts
  FROM public.journal_settings js
  WHERE js.singleton = true
  LIMIT 1;

  IF NEW.submission_doi IS NULL
     AND (NEW.status IS DISTINCT FROM 'draft' OR COALESCE(mint_drafts, false)) THEN
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
$function$;