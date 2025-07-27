import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HeartIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface VotingSystemProps {
  submissionId: number;
  initialVotes: number;
  className?: string;
}

export const VotingSystem = ({ submissionId, initialVotes, className }: VotingSystemProps) => {
  const [votes, setVotes] = useState(initialVotes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkUserVote();
    }
  }, [user, submissionId]);

  const checkUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('image_votes')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('voter_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking vote:', error);
        return;
      }

      setHasVoted(!!data);
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on submissions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('image_votes')
          .delete()
          .eq('submission_id', submissionId)
          .eq('voter_id', user.id);

        if (error) throw error;

        setVotes(prev => prev - 1);
        setHasVoted(false);
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
      } else {
        // Add vote
        const { error } = await supabase
          .from('image_votes')
          .insert({
            submission_id: submissionId,
            voter_id: user.id,
          });

        if (error) throw error;

        setVotes(prev => prev + 1);
        setHasVoted(true);
        toast({
          title: "Vote added",
          description: "Thanks for voting!",
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to process your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={hasVoted ? "default" : "outline"}
        size="sm"
        onClick={handleVote}
        disabled={loading}
        className="flex items-center space-x-1"
      >
        {hasVoted ? (
          <Heart className="w-4 h-4 fill-current" />
        ) : (
          <HeartIcon className="w-4 h-4" />
        )}
        <span>{votes}</span>
      </Button>
    </div>
  );
};