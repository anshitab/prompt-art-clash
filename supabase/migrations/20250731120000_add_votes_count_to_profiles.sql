-- Add votes_count column to profiles table for leaderboard ranking
ALTER TABLE public.profiles 
ADD COLUMN votes_count integer DEFAULT 0 NOT NULL;

-- Create index on votes_count for better query performance
CREATE INDEX idx_profiles_votes_count ON public.profiles(votes_count DESC);

-- Update existing profiles to have 0 votes initially
UPDATE public.profiles SET votes_count = 0 WHERE votes_count IS NULL;
