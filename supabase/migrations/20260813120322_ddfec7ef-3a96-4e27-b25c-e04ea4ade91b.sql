-- ============ ARTICLE TYPES ============
CREATE TABLE public.article_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  reporting_guideline text,
  requires_trial_registration boolean NOT NULL DEFAULT false,
  requires_ethics_approval boolean NOT NULL DEFAULT true,
  max_abstract_words integer,
  max_word_count integer,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.article_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_types TO authenticated;
GRANT ALL ON public.article_types TO service_role;

ALTER TABLE public.article_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active article types"
  ON public.article_types FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'journal_manager'));

CREATE POLICY "Managers can insert article types"
  ON public.article_types FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'journal_manager'));

CREATE POLICY "Managers can update article types"
  ON public.article_types FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'journal_manager'));

CREATE POLICY "Managers can delete article types"
  ON public.article_types FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'journal_manager'));

CREATE TRIGGER update_article_types_updated_at
  BEFORE UPDATE ON public.article_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.article_types (code, label, description, reporting_guideline, requires_trial_registration, requires_ethics_approval, max_abstract_words, max_word_count, display_order)
VALUES
  ('original_research', 'Original Research', 'Original clinical or basic science study reporting primary data.', 'STROBE', false, true, 300, 4000, 1),
  ('systematic_review', 'Systematic Review', 'Structured review with an explicit, reproducible search strategy.', 'PRISMA 2020', false, false, 300, 5000, 2),
  ('meta_analysis', 'Meta-analysis', 'Quantitative synthesis of results from multiple studies.', 'PRISMA 2020', false, false, 300, 5000, 3),
  ('narrative_review', 'Narrative Review', 'Expert overview of a topic without a systematic search protocol.', NULL, false, false, 300, 5000, 4),
  ('case_report', 'Case Report', 'Detailed report of a single patient case.', 'CARE', false, true, 200, 1500, 5),
  ('case_series', 'Case Series', 'Report of a consecutive series of patient cases.', 'CARE', false, true, 250, 2500, 6),
  ('clinical_guideline', 'Clinical Guideline', 'Clinical practice recommendations developed by a panel.', 'RIGHT', false, false, 300, 6000, 7),
  ('short_communication', 'Short Communication', 'Brief report of a focused finding.', 'STROBE', false, true, 150, 1500, 8),
  ('letter_to_editor', 'Letter to the Editor', 'Correspondence regarding published content or a clinical observation.', NULL, false, false, 0, 800, 9),
  ('editorial', 'Editorial', 'Invited commentary from the editorial team.', NULL, false, false, 0, 1200, 10);

-- ============ SUBMISSION FIELDS ============
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS article_type_id uuid REFERENCES public.article_types(id),
  ADD COLUMN IF NOT EXISTS word_count integer,
  ADD COLUMN IF NOT EXISTS manuscript_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS funding_statement text,
  ADD COLUMN IF NOT EXISTS conflict_of_interest_statement text,
  ADD COLUMN IF NOT EXISTS data_availability_statement text,
  ADD COLUMN IF NOT EXISTS ethics_approval_number text,
  ADD COLUMN IF NOT EXISTS ethics_committee text,
  ADD COLUMN IF NOT EXISTS trial_registration_id text,
  ADD COLUMN IF NOT EXISTS trial_registry text,
  ADD COLUMN IF NOT EXISTS patient_consent_obtained boolean,
  ADD COLUMN IF NOT EXISTS reporting_guideline text,
  ADD COLUMN IF NOT EXISTS ai_disclosure text,
  ADD COLUMN IF NOT EXISTS acknowledgments text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz;

-- ============ SUBMISSION AUTHORS ============
CREATE TABLE public.submission_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  degree text,
  orcid_id text,
  department text,
  institution text,
  country text,
  email text,
  author_role text,
  credit_roles text[] NOT NULL DEFAULT '{}',
  is_corresponding boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX submission_authors_submission_id_idx ON public.submission_authors(submission_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_authors TO authenticated;
GRANT ALL ON public.submission_authors TO service_role;

ALTER TABLE public.submission_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and editors can view submission authors"
  ON public.submission_authors FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
    OR public.has_role(auth.uid(), 'section_editor')
  );

CREATE POLICY "Owners and editors can insert submission authors"
  ON public.submission_authors FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Owners and editors can update submission authors"
  ON public.submission_authors FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Owners and editors can delete submission authors"
  ON public.submission_authors FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE TRIGGER update_submission_authors_updated_at
  BEFORE UPDATE ON public.submission_authors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUBMISSION DECLARATIONS ============
CREATE TABLE public.submission_declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE,
  ethics_approval boolean NOT NULL DEFAULT false,
  ethics_not_applicable boolean NOT NULL DEFAULT false,
  informed_consent boolean NOT NULL DEFAULT false,
  consent_not_applicable boolean NOT NULL DEFAULT false,
  conflict_of_interest boolean NOT NULL DEFAULT false,
  funding_disclosed boolean NOT NULL DEFAULT false,
  data_availability boolean NOT NULL DEFAULT false,
  author_contributions boolean NOT NULL DEFAULT false,
  acknowledgments_confirmed boolean NOT NULL DEFAULT false,
  ai_assistance_used boolean NOT NULL DEFAULT false,
  ai_assistance_declared boolean NOT NULL DEFAULT false,
  trial_registration_confirmed boolean NOT NULL DEFAULT false,
  not_published_elsewhere boolean NOT NULL DEFAULT false,
  no_plagiarism boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_declarations TO authenticated;
GRANT ALL ON public.submission_declarations TO service_role;

ALTER TABLE public.submission_declarations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and editors can view declarations"
  ON public.submission_declarations FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
    OR public.has_role(auth.uid(), 'section_editor')
  );

CREATE POLICY "Owners can insert declarations"
  ON public.submission_declarations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Owners can update declarations"
  ON public.submission_declarations FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Managers can delete declarations"
  ON public.submission_declarations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'journal_manager'));

CREATE TRIGGER update_submission_declarations_updated_at
  BEFORE UPDATE ON public.submission_declarations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUBMISSION CHECKLIST ============
CREATE TABLE public.submission_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  item_key text NOT NULL,
  label text NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  passed boolean NOT NULL DEFAULT false,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (submission_id, item_key)
);

CREATE INDEX submission_checklist_submission_id_idx ON public.submission_checklist_items(submission_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_checklist_items TO authenticated;
GRANT ALL ON public.submission_checklist_items TO service_role;

ALTER TABLE public.submission_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and editors can view checklist"
  ON public.submission_checklist_items FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
    OR public.has_role(auth.uid(), 'section_editor')
  );

CREATE POLICY "Owners can insert checklist"
  ON public.submission_checklist_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Owners can update checklist"
  ON public.submission_checklist_items FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE POLICY "Owners can delete checklist"
  ON public.submission_checklist_items FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'journal_manager')
  );

CREATE TRIGGER update_submission_checklist_updated_at
  BEFORE UPDATE ON public.submission_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUDIT LOG (append-only) ============
CREATE TABLE public.submission_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  actor_id uuid,
  actor_role text,
  action text NOT NULL,
  from_value text,
  to_value text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX submission_audit_log_submission_id_idx ON public.submission_audit_log(submission_id, created_at DESC);

GRANT SELECT, INSERT ON public.submission_audit_log TO authenticated;
GRANT ALL ON public.submission_audit_log TO service_role;

ALTER TABLE public.submission_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors can view audit log"
  ON public.submission_audit_log FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'journal_manager')
    OR public.has_role(auth.uid(), 'section_editor')
  );

CREATE POLICY "Authenticated users can append audit entries"
  ON public.submission_audit_log FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- ============ BACKFILL AUTHORS FROM METADATA ============
INSERT INTO public.submission_authors (submission_id, full_name, institution, email, orcid_id, is_corresponding, display_order)
SELECT
  s.id,
  COALESCE(NULLIF(a.value ->> 'name', ''), 'Unnamed author'),
  NULLIF(a.value ->> 'affiliation', ''),
  NULLIF(a.value ->> 'email', ''),
  NULLIF(a.value ->> 'orcid', ''),
  COALESCE((a.value ->> 'corresponding')::boolean, false),
  a.ordinality - 1
FROM public.submissions s
CROSS JOIN LATERAL jsonb_array_elements(s.metadata -> 'authors') WITH ORDINALITY AS a(value, ordinality)
WHERE s.metadata ? 'authors'
  AND jsonb_typeof(s.metadata -> 'authors') = 'array'
  AND NOT EXISTS (SELECT 1 FROM public.submission_authors sa WHERE sa.submission_id = s.id);
