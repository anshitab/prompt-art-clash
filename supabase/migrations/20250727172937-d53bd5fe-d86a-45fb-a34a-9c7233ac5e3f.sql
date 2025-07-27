-- Create user profiles table for authentication
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text,
  institute_name text,
  avatar_url text,
  bio text,
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, institute_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'institute_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing tables to support voting
ALTER TABLE public.submissions 
ADD COLUMN votes_count integer DEFAULT 0,
ADD COLUMN user_uuid uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create votes table for the voting system
CREATE TABLE public.image_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id bigint REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  voter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(submission_id, voter_id)
);

-- Enable RLS on image_votes
ALTER TABLE public.image_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for image_votes
CREATE POLICY "Users can view all votes" 
ON public.image_votes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.image_votes FOR INSERT 
WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users can delete their own votes" 
ON public.image_votes FOR DELETE 
USING (auth.uid() = voter_id);

-- Function to update vote count
CREATE OR REPLACE FUNCTION public.update_submission_votes()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.submissions 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.submission_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.submissions 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.submission_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for vote counting
CREATE TRIGGER update_votes_on_insert
AFTER INSERT ON public.image_votes
FOR EACH ROW EXECUTE FUNCTION public.update_submission_votes();

CREATE TRIGGER update_votes_on_delete
AFTER DELETE ON public.image_votes
FOR EACH ROW EXECUTE FUNCTION public.update_submission_votes();