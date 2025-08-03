import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Palette, Sparkles, Users } from 'lucide-react';

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedRole: string) => {
    localStorage.setItem('role', selectedRole);
    if (selectedRole === 'host' || selectedRole === 'institute') {
      navigate('/create-battle');
    } else {
      navigate('/generate');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg text-muted-foreground">
            Select how you want to participate in the AI art community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Host/Institute Role */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleSelect('host')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Host Competitions</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Create and manage AI art competitions. Set themes, rules, and bring together creative communities.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Create competitions</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Manage participants</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>Set themes and rules</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Become a Host
              </Button>
            </CardContent>
          </Card>

          {/* Participant/User Role */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleSelect('user')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Join Competitions</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Participate in AI art competitions. Create amazing artwork, compete with others, and showcase your creativity.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>Create AI art</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Join competitions</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Showcase creativity</span>
                </div>
              </div>
              <Button className="w-full" size="lg" variant="outline">
                Join as Participant
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can change your role anytime from your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
