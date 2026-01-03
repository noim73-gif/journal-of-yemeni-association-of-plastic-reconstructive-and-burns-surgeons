-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Policy: Anyone can view article images (public bucket)
CREATE POLICY "Article images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');

-- Policy: Admins can upload article images
CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update article images
CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete article images
CREATE POLICY "Admins can delete article images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));