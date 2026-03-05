
-- =============================================
-- OJS-Compliant Database Schema Migration
-- =============================================

-- 1. Journal Issues table (Volume/Number/Year management)
CREATE TABLE public.journal_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volume integer NOT NULL,
  number integer NOT NULL,
  year integer NOT NULL,
  title text,
  description text,
  cover_image_url text,
  published_at timestamp with time zone,
  is_current boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(volume, number, year)
);

ALTER TABLE public.journal_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published issues" ON public.journal_issues
  FOR SELECT USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage issues" ON public.journal_issues
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 2. Add workflow columns to submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS workflow_stage text NOT NULL DEFAULT 'submission' CHECK (workflow_stage IN ('submission', 'review', 'copyediting', 'production', 'publication')),
  ADD COLUMN IF NOT EXISTS review_type text DEFAULT 'double_blind' CHECK (review_type IN ('single_blind', 'double_blind', 'open')),
  ADD COLUMN IF NOT EXISTS editor_id uuid,
  ADD COLUMN IF NOT EXISTS section_editor_id uuid,
  ADD COLUMN IF NOT EXISTS copyeditor_id uuid,
  ADD COLUMN IF NOT EXISTS layout_editor_id uuid,
  ADD COLUMN IF NOT EXISTS journal_issue_id uuid REFERENCES public.journal_issues(id),
  ADD COLUMN IF NOT EXISTS decision text CHECK (decision IN ('accept', 'minor_revisions', 'major_revisions', 'reject', 'pending')),
  ADD COLUMN IF NOT EXISTS decision_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS revision_number integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- 3. Submission files (version control)
CREATE TABLE public.submission_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT 'manuscript' CHECK (file_type IN ('manuscript', 'supplementary', 'revision', 'copyedited', 'galley_pdf', 'galley_html', 'galley_xml', 'cover_letter', 'response_to_reviewers')),
  version integer NOT NULL DEFAULT 1,
  stage text NOT NULL DEFAULT 'submission' CHECK (stage IN ('submission', 'review', 'copyediting', 'production', 'publication')),
  uploaded_by uuid NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all files" ON public.submission_files
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can view own submission files" ON public.submission_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Authors can upload to own submissions" ON public.submission_files
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Reviewers can view assigned submission files" ON public.submission_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.submission_reviews sr WHERE sr.submission_id = submission_files.submission_id AND sr.reviewer_id = auth.uid())
  );

-- 4. Editorial decisions log
CREATE TABLE public.editorial_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  editor_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision IN ('accept', 'minor_revisions', 'major_revisions', 'reject', 'send_to_review', 'send_to_copyediting', 'send_to_production', 'publish')),
  stage text NOT NULL CHECK (stage IN ('submission', 'review', 'copyediting', 'production', 'publication')),
  comments text,
  notify_author boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.editorial_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage decisions" ON public.editorial_decisions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view decisions" ON public.editorial_decisions
  FOR SELECT USING (editor_id = auth.uid());

CREATE POLICY "Authors can view decisions on own submissions" ON public.editorial_decisions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid())
  );

-- 5. Article galleys for production stage
CREATE TABLE public.article_galleys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'PDF',
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'html', 'xml', 'epub')),
  locale text DEFAULT 'en',
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.article_galleys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view galleys of published articles" ON public.article_galleys
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id AND a.published_at IS NOT NULL AND a.published_at <= now())
  );

CREATE POLICY "Admins can manage galleys" ON public.article_galleys
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 6. Add updated_at triggers
CREATE TRIGGER update_journal_issues_updated_at
  BEFORE UPDATE ON public.journal_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_galleys_updated_at
  BEFORE UPDATE ON public.article_galleys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Link articles to journal issues
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS journal_issue_id uuid REFERENCES public.journal_issues(id),
  ADD COLUMN IF NOT EXISTS submission_id uuid REFERENCES public.submissions(id),
  ADD COLUMN IF NOT EXISTS pages text,
  ADD COLUMN IF NOT EXISTS article_number integer,
  ADD COLUMN IF NOT EXISTS keywords text[];
