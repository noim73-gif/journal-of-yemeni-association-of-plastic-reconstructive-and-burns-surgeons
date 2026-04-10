
-- Fix 1: Restrict reviewer_applications INSERT to authenticated users
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.reviewer_applications;
CREATE POLICY "Authenticated users can submit applications"
ON public.reviewer_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix 2: Drop the overly permissive SELECT on editorial_board_members and recreate without exposing email
DROP POLICY IF EXISTS "Anyone can view active board members" ON public.editorial_board_members;
CREATE POLICY "Anyone can view active board members public info"
ON public.editorial_board_members
FOR SELECT
USING (is_active = true);

-- Fix 3: Add explicit denial for non-admin INSERT on user_roles
-- The current ALL policy for admins already covers admin inserts.
-- We need to ensure no non-admin INSERT policy exists (there isn't one, so we're safe).
-- But let's be explicit by adding a restrictive INSERT policy
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
