import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Palette, Heart, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { VotingSystem } from '@/components/VotingSystem';

interface Submission {
  id: number;
  prompt: string;
  image_url: string;
  created_at: string;
  user_id: number | null;
  votes_count: number | null;
}

const Gallery = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchSubmissions();
  }, [sortBy]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('submissions')
        .select('*');

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        console.log('Fetched submissions:', data?.length || 0);
        if (data && data.length > 0) {
          console.log('First submission image URL length:', data[0].image_url?.length || 0);
        }
        setSubmissions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Gallery Header */}
      <div className="container mx-auto px-4 py-6 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Community Gallery</h1>
            <p className="text-muted-foreground mt-1">
              Discover amazing AI-generated art from our creative community
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Newest</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Oldest</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to create amazing AI art!</p>
            <Link to="/generate">
              <Button>
                <Sparkles className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  {submission.image_url ? (
                    <img
                      src={submission.image_url}
                      alt="AI Generated Art"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image failed to load:', submission.image_url);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-muted flex items-center justify-center ${submission.image_url ? 'hidden' : ''}`}>
                    <Palette className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {submission.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(submission.created_at)}</span>
                      <VotingSystem 
                        submissionId={submission.id} 
                        initialVotes={submission.votes_count || 0}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;