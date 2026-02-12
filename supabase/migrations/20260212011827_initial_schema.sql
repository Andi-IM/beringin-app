-- Create concepts table
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  parent_id UUID REFERENCES public.concepts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  answer_criteria TEXT NOT NULL,
  type TEXT NOT NULL, -- 'flashcard' | 'multiple_choice'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID NOT NULL,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'new' | 'learning' | 'fragile' | 'stable' | 'lapsed'
  next_review TIMESTAMPTZ NOT NULL,
  last_interval INTEGER NOT NULL DEFAULT 0,
  ease_factor FLOAT NOT NULL DEFAULT 2.5,
  history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, concept_id)
);

-- Enable RLS
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to concepts" ON public.concepts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow users to manage their own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);
