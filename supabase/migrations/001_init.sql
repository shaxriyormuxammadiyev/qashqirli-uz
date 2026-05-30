-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audio articles table
CREATE TABLE IF NOT EXISTS public.audio_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  audio_url TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Public read for content (hamma ko'ra oladi)
CREATE POLICY IF NOT EXISTS "public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "public read audio" ON public.audio_articles FOR SELECT USING (true);

-- Faqat autentifikatsiya qilingan admin yoza oladi
CREATE POLICY IF NOT EXISTS "auth write articles" ON public.articles
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "auth write audio" ON public.audio_articles
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Subscribers: hamma obuna bo'la oladi, faqat admin ko'ra/o'chira oladi
CREATE POLICY IF NOT EXISTS "anyone subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "auth read subscribers" ON public.subscribers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "auth manage subscribers" ON public.subscribers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY IF NOT EXISTS "public read audio bucket" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY IF NOT EXISTS "auth upload audio bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "auth delete audio bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "public read covers bucket" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY IF NOT EXISTS "auth upload covers bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "auth delete covers bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
