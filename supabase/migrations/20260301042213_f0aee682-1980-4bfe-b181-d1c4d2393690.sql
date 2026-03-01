
-- Add new columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profession text,
  ADD COLUMN IF NOT EXISTS primary_specialty text,
  ADD COLUMN IF NOT EXISTS additional_specialties text,
  ADD COLUMN IF NOT EXISTS postal_code text;

-- Update the handle_new_user trigger to persist extra registration fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, profession, primary_specialty, additional_specialties, postal_code)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'profession',
    new.raw_user_meta_data ->> 'primary_specialty',
    new.raw_user_meta_data ->> 'additional_specialties',
    new.raw_user_meta_data ->> 'postal_code'
  );
  RETURN new;
END;
$function$;
