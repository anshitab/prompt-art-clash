import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Users, 
  Clock, 
  Calendar, 
  Sparkles, 
  Target, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Battle {
  id: string;
  title: string;
  description: string;
  theme: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'active' | 'voting' | 'ended';
  created_at: string;
}

const JoinCompetition = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningBattle, setJoiningBattle] = useState<string | null>(null);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchBattles();
    fetchUserParticipations();
  }, []);

  const fetchBattles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('battles' as any)
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      setBattles((data as any) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load competitions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('battle_participants' as any)
        .select('battle_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setUserParticipations(new Set((data as any)?.map((p: any) => p.battle_id) || []));
      }
    } catch (error) {
      console.error('Error fetching user participations:', error);
    }
  };

  const joinBattle = async (battleId: string) => {
    setJoiningBattle(battleId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to join competitions.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('battle_participants' as any)
        .insert([{ battle_id: battleId, user_id: user.id }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Already Joined',
            description: 'You have already joined this competition.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Success!',
          description: 'You have successfully joined the competition.',
        });
        setUserParticipations(prev => new Set([...prev, battleId]));
        fetchBattles(); // Refresh to update participant count
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join competition.',
        variant: 'destructive',
      });
    } finally {
      setJoiningBattle(null);
    }
  };

  const getStatusBadge = (status: string, startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-600">Ended</Badge>;
    }
  };

  const getStatusIcon = (status: string, startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return <Clock className="w-5 h-5 text-blue-500" />;
    } else if (now >= start && now <= end) {
      return <Target className="w-5 h-5 text-green-500" />;
    } else {
      return <CheckCircle className="w-5 h-5 text-gray-500" />;
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

  const isBattleJoinable = (battle: Battle) => {
    const now = new Date();
    const start = new Date(battle.start_time);
    const end = new Date(battle.end_time);
    return now >= start && now <= end && battle.current_participants < battle.max_participants;
  };

  const isUserParticipating = (battleId: string) => {
    return userParticipations.has(battleId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Join Competitions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover exciting AI art competitions and showcase your creativity. Join battles, create amazing art, and compete with the best!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Active Battles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : 
                  battles.filter(b => isBattleJoinable(b)).length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Ready to join</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Total Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : 
                  battles.reduce((sum, b) => sum + b.current_participants, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Across all battles</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Your Battles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : 
                  userParticipations.size}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Joined competitions</p>
            </CardContent>
          </Card>
        </div>

        {/* Battles Grid */}
        <div className="space-y-6">
          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : battles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No competitions available</h3>
                <p className="text-muted-foreground mb-4">
                  Check back later for new competitions or create your own!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {battles.map((battle) => (
                <Card key={battle.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {battle.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {battle.theme}
                        </p>
                      </div>
                      {getStatusIcon(battle.status, battle.start_time, battle.end_time)}
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(battle.status, battle.start_time, battle.end_time)}
                      {isUserParticipating(battle.id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Joined
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {battle.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatDate(battle.start_time)} - {formatDate(battle.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {battle.current_participants}/{battle.max_participants} participants
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      {isUserParticipating(battle.id) ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Already Joined
                        </Button>
                      ) : isBattleJoinable(battle) ? (
                        <Button 
                          onClick={() => joinBattle(battle.id)}
                          disabled={joiningBattle === battle.id}
                          className="w-full"
                        >
                          {joiningBattle === battle.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Join Competition
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          <XCircle className="w-4 h-4 mr-2" />
                          {new Date() < new Date(battle.start_time) ? 'Not Started' : 'Ended'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinCompetition;
