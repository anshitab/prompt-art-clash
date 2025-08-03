import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Palette, Heart, Clock, Sparkles, Grid, List, Eye, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layouts/AppLayout';
import { PageHeader } from '@/components/layouts/PageHeader';
import { PageContainer } from '@/components/layouts/PageContainer';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <AppLayout>
      <PageHeader 
        title="Community Gallery" 
        description="Discover amazing AI-generated art from our creative community. Vote for your favorites and explore diverse artistic styles."
      >
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Newest First</span>
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Oldest First</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContainer className="section-spacing">
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="aspect-square bg-muted"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No submissions yet</h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              Be the first to create amazing AI art and share it with the community!
            </p>
            <Link to="/generate">
              <Button size="lg" className="shadow-lg hover:shadow-glow transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="element-spacing">
            {/* Stats Bar */}
            <div className="bg-gradient-to-r from-muted/50 to-background rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gradient">{submissions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Artworks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {submissions.reduce((sum, s) => sum + (s.votes_count || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {new Set(submissions.map(s => s.user_id)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Artists</div>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {submissions.map((submission) => (
                <Card key={submission.id} className="card-hover group overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    {submission.image_url ? (
                      <img
                        src={submission.image_url}
                        alt="AI Generated Art"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          console.error('Image failed to load:', submission.image_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-muted flex items-center justify-center ${submission.image_url ? 'hidden' : ''}`}>
                      <Palette className="w-12 h-12 text-muted-foreground" />
                    </div>
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    
                    {/* Date badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-xs"
                    >
                      {formatDate(submission.created_at)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium line-clamp-3 group-hover:text-primary transition-colors leading-relaxed">
                        {submission.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <VotingSystem 
                          submissionId={submission.id} 
                          initialVotes={submission.votes_count || 0}
                        />
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>234</span> {/* Placeholder view count */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {submissions.length >= 50 && (
              <div className="text-center pt-8">
                <Button size="lg" variant="outline" className="min-w-48 shadow-md hover:shadow-lg transition-shadow">
                  Load More Artwork
                </Button>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </AppLayout>
  );
};

export default Gallery;