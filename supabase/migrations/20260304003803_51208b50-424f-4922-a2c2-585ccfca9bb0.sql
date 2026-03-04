
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS introduction text,
  ADD COLUMN IF NOT EXISTS methods text,
  ADD COLUMN IF NOT EXISTS results text,
  ADD COLUMN IF NOT EXISTS discussion text,
  ADD COLUMN IF NOT EXISTS "references" text;
