-- Create submissions table for storing AI-generated images
CREATE TABLE public.submissions (
  id BIGSERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  user_id BIGINT,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own submissions" 
ON public.submissions 
FOR UPDATE 
USING (true); 