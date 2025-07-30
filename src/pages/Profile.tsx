import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Building, Trophy, Palette, Users, Calendar, Edit2, Save, X } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  institute_name: string | null;
  bio: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Competition {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  status: boolean;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    institute_name: '',
    bio: '',
    role: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCompetitions();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setEditForm({
        full_name: data.full_name || '',
        institute_name: data.institute_name || '',
        bio: data.bio || '',
        role: data.role || 'user'
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching competitions:', error);
        return;
      }

      setCompetitions(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          institute_name: editForm.institute_name,
          bio: editForm.bio,
          role: editForm.role
        })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      await fetchProfile();
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'institute':
        return 'default';
      case 'participant':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Profile not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.avatar_url || ''} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile.full_name || 'Anonymous User'}
                    </h1>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getRoleBadgeVariant(profile.role)}>
                        {profile.role === 'institute' ? 'Institute' : 
                         profile.role === 'participant' ? 'Participant' : 'User'}
                      </Badge>
                      {profile.institute_name && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Building className="w-4 h-4" />
                          <span>{profile.institute_name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? <X className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                {profile.bio && (
                  <p className="text-foreground">{profile.bio}</p>
                )}

                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {editing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institute_name">Institute/Organization</Label>
                  <Input
                    id="institute_name"
                    value={editForm.institute_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, institute_name: e.target.value }))}
                    placeholder="Enter your institute name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="institute">Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role-based Content */}
        <Tabs defaultValue={profile.role === 'institute' ? 'hosting' : 'battles'}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="battles">
              {profile.role === 'institute' ? 'Hosted Battles' : 'Available Battles'}
            </TabsTrigger>
            <TabsTrigger value={profile.role === 'institute' ? 'hosting' : 'submissions'}>
              {profile.role === 'institute' ? 'Host New Battle' : 'My Submissions'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="battles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>{profile.role === 'institute' ? 'Your Hosted Battles' : 'Available Battles'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {competitions.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No battles available yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {competitions.map((competition) => (
                      <Card key={competition.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{competition.title}</h3>
                              <p className="text-muted-foreground">{competition.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Starts: {formatDate(competition.starts_at)}</span>
                                <span>Ends: {formatDate(competition.ends_at)}</span>
                              </div>
                            </div>
                            <Badge variant={competition.status ? 'default' : 'secondary'}>
                              {competition.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={profile.role === 'institute' ? 'hosting' : 'submissions'} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {profile.role === 'institute' ? (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Host New Battle</span>
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5" />
                      <span>My Submissions</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {profile.role === 'institute' ? (
                      <Users className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Palette className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {profile.role === 'institute' 
                      ? 'Battle hosting functionality coming soon!' 
                      : 'No submissions yet. Start creating art!'}
                  </p>
                  {profile.role !== 'institute' && (
                    <Button>
                      <Palette className="w-4 h-4 mr-2" />
                      Start Creating
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;