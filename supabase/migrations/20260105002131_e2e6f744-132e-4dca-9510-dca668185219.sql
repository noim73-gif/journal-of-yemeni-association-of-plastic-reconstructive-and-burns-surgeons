-- Add DOI column to articles table
ALTER TABLE public.articles 
ADD COLUMN doi text UNIQUE;

-- Create function to generate DOI automatically
CREATE OR REPLACE FUNCTION public.generate_article_doi()
RETURNS TRIGGER AS $$
DECLARE
  journal_prefix TEXT := '10.1234/jprs'; -- Journal prefix (customizable)
  year_part TEXT;
  article_number TEXT;
BEGIN
  -- Only generate if DOI is null and article is being published
  IF NEW.doi IS NULL AND NEW.published_at IS NOT NULL THEN
    year_part := EXTRACT(YEAR FROM COALESCE(NEW.published_at, NOW()))::TEXT;
    article_number := SUBSTRING(NEW.id::TEXT FROM 1 FOR 8);
    NEW.doi := journal_prefix || '.' || year_part || '.' || article_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic DOI generation on publish
CREATE TRIGGER generate_doi_on_publish
BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.generate_article_doi();

-- Create index for DOI lookups
CREATE INDEX idx_articles_doi ON public.articles(doi) WHERE doi IS NOT NULL;