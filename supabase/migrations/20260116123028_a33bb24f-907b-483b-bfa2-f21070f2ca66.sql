-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create an index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add a check constraint to ensure username follows valid format (alphanumeric, underscores, 3-30 chars)
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format CHECK (
  username IS NULL OR (
    LENGTH(username) >= 3 AND 
    LENGTH(username) <= 30 AND 
    username ~ '^[a-zA-Z0-9_]+$'
  )
);