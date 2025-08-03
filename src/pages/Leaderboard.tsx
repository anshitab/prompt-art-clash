import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Medal, Star, Palette, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Leaderboard = () => {
  type Creator = {
    id: string;
    user_id: string;
    full_name: string;
    institute_name: string;
    avatar_url: string | null;
    role: string;
    submissions_count: number;
    created_at: string;
    rank?: number;
  };

  type Statistics = {
    totalBattles: number;
    activeCreators: number;
    imagesCreated: number;
  };

  const [topCreators, setTopCreators] = useState<Creator[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalBattles: 0,
    activeCreators: 0,
    imagesCreated: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("profiles" as any)
          .select("id, user_id, full_name, institute_name, avatar_url, role, submissions_count, created_at")
          .order("submissions_count", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          setError("Failed to load leaderboard data. Please try again later.");
          return;
        } 
        
        if (!data) {
          setTopCreators([]);
          return;
        }
        
        const ranked = (data as any as Creator[]).map((creator, i) => ({
          ...creator,
          rank: i + 1,
        }));
        setTopCreators(ranked);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStatistics = async () => {
      try {
        // Get total user count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get active creators (users with votes > 0)
        const { count: activeCreators } = await supabase
          .from('profiles' as any)
          .select('*', { count: 'exact', head: true })
          .gt('submissions_count', 0);

        // Get total votes as proxy for images/artworks created
        const { data: votesData } = await supabase
          .from('profiles' as any)
          .select('submissions_count');
        
        const totalVotes = (votesData as any)?.reduce((sum: number, user: any) => sum + (user.submissions_count || 0), 0) || 0;

        setStatistics({
          totalBattles: totalUsers || 0,
          activeCreators: activeCreators || 0,
          imagesCreated: totalVotes
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        // Keep default values if statistics fail
      }
    };

    fetchLeaderboard();
    fetchStatistics();

    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles', // Fixed: using correct table name
        }, 
        () => {
          fetchLeaderboard();
          fetchStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
    
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-800/30";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-800/30";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-800/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Hall of Fame
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most creative prompt masters in our community. Climb the ranks by creating amazing art!
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : statistics.totalBattles}
                </div>
                <p className="text-sm text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : statistics.activeCreators}
                </div>
                <p className="text-sm text-muted-foreground mt-1">With votes</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : statistics.imagesCreated}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Community wide</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span>Top Creators</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {loading && !error && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
              {!loading && !error && topCreators.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No creators found. Be the first to join!
                </div>
              )}
              {!loading && !error && topCreators.map((creator) => (
                <div
                  key={creator.rank}
                  className={`p-4 rounded-lg border ${getRankStyle(creator.rank)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(creator.rank!)}
                        <span className="text-2xl font-bold text-black">
                          #{creator.rank}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {creator.avatar_url && (
                          <img 
                            src={creator.avatar_url} 
                            alt={`${creator.full_name}'s avatar`} 
                            className="w-10 h-10 rounded-full object-cover" 
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-black">{creator.full_name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-black">
                            <span>{creator.institute_name}</span>
                            <span>{creator.role}</span>
                            <span>{creator.submissions_count} submissions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {creator.submissions_count}
                      </div>
                      <div className="text-xs text-black">submissions</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-primary">Ready to Join the Leaderboard?</h2>
              <p className="text-muted-foreground">
                Start creating amazing AI art and compete with the best prompt masters!
              </p>
              <Link to="/generate">
                <Button size="lg" className="font-semibold">
                  <Palette className="w-4 h-4 mr-2" />
                  Start Creating
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
