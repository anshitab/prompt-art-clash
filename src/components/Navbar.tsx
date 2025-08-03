import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Palette, User, LogOut, Building, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string | null;
  institute_name: string | null;
  avatar_url: string | null;
  role?: string | null;
}

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, institute_name, avatar_url, role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                PromptArtClash
              </h1>
              <p className="text-xs text-muted-foreground">AI Art Battle Arena</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Show these links only to participants/users */}
            {(profile?.role === 'user' || profile?.role === 'participant' || !profile?.role) && (
              <>
                <Link to="/generate">
                  <Button variant={location.pathname === '/generate' ? 'default' : 'ghost'} size="sm">
                    Generate
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant={location.pathname === '/gallery' ? 'default' : 'ghost'} size="sm">
                    Gallery
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant={location.pathname === '/leaderboard' ? 'default' : 'ghost'} size="sm">
                    <Trophy className="w-4 h-4 mr-1" />
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/join-competition">
                  <Button variant={location.pathname === '/join-competition' ? 'default' : 'ghost'} size="sm">
                    <Trophy className="w-4 h-4 mr-1" />
                    Competitions
                  </Button>
                </Link>
              </>
            )}
            
            {/* Show create button only to hosts/institutes */}
            {(profile?.role === 'host' || profile?.role === 'institute') && (
              <Link to="/create-battle">
                <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Create Competition
                </Button>
              </Link>
            )}

            {/* User Profile or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ''} alt="Avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-4">
                    <div className="flex flex-col space-y-2 leading-none">
                      {profile?.full_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium">{profile.full_name}</p>
                        </div>
                      )}
                      {profile?.institute_name && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">
                            {profile.institute_name}
                          </Badge>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};