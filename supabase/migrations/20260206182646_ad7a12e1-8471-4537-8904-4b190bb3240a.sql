-- Create enum for board member roles
CREATE TYPE public.board_member_role AS ENUM ('editor_in_chief', 'associate_editor', 'board_member', 'international_advisor');

-- Create editorial board members table
CREATE TABLE public.editorial_board_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role board_member_role NOT NULL,
  title TEXT,
  affiliation TEXT,
  specialty TEXT,
  email TEXT,
  orcid_id TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.editorial_board_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view active board members
CREATE POLICY "Anyone can view active board members"
ON public.editorial_board_members
FOR SELECT
USING (is_active = true);

-- Admins can manage all board members
CREATE POLICY "Admins can manage all board members"
ON public.editorial_board_members
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_editorial_board_members_updated_at
BEFORE UPDATE ON public.editorial_board_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();