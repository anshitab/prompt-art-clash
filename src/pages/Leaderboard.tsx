import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette, Trophy, Crown, Medal, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { cn } from '@/lib/utils'; 

const Leaderboard = () => {
  type Creator = {
    id: string;
    username: string;
    submissions_count: number;
    votes_count: number;
    streak: number;
    rank?: number;
  };

  const [topCreators, setTopCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, submissions_count, votes_count, streak")
        .order("votes_count", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        const ranked = data.map((creator, i) => ({ ...creator, rank: i + 1 }));
        setTopCreators(ranked);
      }
    };

    fetchLeaderboard();

    const subscription = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
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
                <CardTitle className="text-lg">Total Battles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1,247</div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">423</div>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Images Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">8,934</div>
                <p className="text-sm text-muted-foreground mt-1">All time</p>
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
              {topCreators.map((creator) => (
                <div
                  key={creator.rank}
                  className={`p-4 rounded-lg border ${getRankStyle(creator.rank)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(creator.rank!)}
                        <span className="text-2xl font-bold text-muted-foreground">
                          #{creator.rank}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{creator.username}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{creator.submissions_count} submissions</span>
                          <span>{creator.votes_count} votes</span>
                          <Badge variant="outline" className="text-xs">
                            {creator.streak} day streak
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {creator.votes_count}
                      </div>
                      <div className="text-xs text-muted-foreground">total votes</div>
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
