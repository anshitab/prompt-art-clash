-- Create generated_images table for storing AI-generated images
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  prompt TEXT NOT NULL,
  image_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all generated images" 
ON public.generated_images 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create generated images" 
ON public.generated_images 
FOR INSERT 
WITH CHECK (true);