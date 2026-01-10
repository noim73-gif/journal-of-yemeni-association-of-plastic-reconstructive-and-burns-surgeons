-- Extend app_role enum to include more roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'doctor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'member';

-- Extend profiles table with additional fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Sana''a',
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Yemen',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'unverified' CHECK (account_status IN ('verified', 'unverified', 'suspended')),
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email_submissions": true, "email_reviews": true, "email_publications": true}'::jsonb;

-- Create doctor_profiles table for medical professionals
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT CHECK (specialty IN ('Plastic Surgery', 'Reconstructive Surgery', 'Burns', 'General Surgery', 'Other')),
  academic_degree TEXT,
  university TEXT,
  hospital TEXT,
  years_of_experience INTEGER,
  medical_license_number TEXT,
  research_interests TEXT[],
  spoken_languages TEXT[] DEFAULT ARRAY['Arabic'],
  is_public_profile BOOLEAN DEFAULT false,
  orcid_id TEXT,
  google_scholar_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on doctor_profiles
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_profiles
CREATE POLICY "Users can view own doctor profile"
ON public.doctor_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own doctor profile"
ON public.doctor_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own doctor profile"
ON public.doctor_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all doctor profiles"
ON public.doctor_profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public profiles are viewable by anyone"
ON public.doctor_profiles
FOR SELECT
USING (is_public_profile = true);

-- Create login_activity table
CREATE TABLE IF NOT EXISTS public.login_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  login_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on login_activity
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own login activity"
ON public.login_activity
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert login activity"
ON public.login_activity
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all login activity"
ON public.login_activity
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for doctor_profiles updated_at
CREATE TRIGGER update_doctor_profiles_updated_at
BEFORE UPDATE ON public.doctor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();