-- Create battles table for storing competition information
CREATE TABLE public.battles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER DEFAULT 100,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'voting', 'ended')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create battle_participants table for tracking who joined which battle
CREATE TABLE public.battle_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(battle_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for battles
CREATE POLICY "Users can view all battles" 
ON public.battles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create battles" 
ON public.battles 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Battle creators can update their battles" 
ON public.battles 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create policies for battle_participants
CREATE POLICY "Users can view all battle participants" 
ON public.battle_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can join battles" 
ON public.battle_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave battles" 
ON public.battle_participants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update participant count
CREATE OR REPLACE FUNCTION public.update_battle_participant_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.battles 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.battle_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.battles 
    SET current_participants = current_participants - 1 
    WHERE id = OLD.battle_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Triggers for participant counting
CREATE TRIGGER update_battle_participants_on_insert
AFTER INSERT ON public.battle_participants
FOR EACH ROW EXECUTE FUNCTION public.update_battle_participant_count();

CREATE TRIGGER update_battle_participants_on_delete
AFTER DELETE ON public.battle_participants
FOR EACH ROW EXECUTE FUNCTION public.update_battle_participant_count(); 