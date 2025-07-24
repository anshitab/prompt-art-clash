import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Users, Palette } from 'lucide-react';

const Landing = () => {
  const todaysTheme = "Cyber Forest";
  const livePromptCount = 247; // This would come from real data

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  PromptClash
                </h1>
                <p className="text-xs text-muted-foreground">AI Art Battle Arena</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/gallery">
                <Button variant="ghost" size="sm">Gallery</Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm">Leaderboard</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Main Tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              PromptClash
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Submit your prompt. Watch it come alive.
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Two prompts enter, one image leaves. Battle other creators with AI-generated art. 
              Let the community decide who has the most creative vision.
            </p>
          </div>

          {/* Today's Theme Card */}
          <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <Badge variant="secondary" className="font-mono">TODAY'S THEME</Badge>
              </div>
              <h2 className="text-2xl font-bold text-primary">{todaysTheme}</h2>
              <p className="text-sm text-muted-foreground">
                {livePromptCount} prompts submitted today
              </p>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate">
              <Button size="lg" className="w-full sm:w-auto font-semibold text-lg px-8 py-6">
                Start Generating
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-lg px-8 py-6">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How PromptClash Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Submit Your Prompt</h3>
                <p className="text-muted-foreground">
                  Enter a creative text prompt based on today's theme. Let your imagination run wild!
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Creates Magic</h3>
                <p className="text-muted-foreground">
                  Our AI instantly transforms your prompt into stunning visual art using cutting-edge models.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community Votes</h3>
                <p className="text-muted-foreground">
                  The community votes on the best images. Climb the leaderboard and become a prompt legend!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Images Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">423</div>
              <div className="text-sm text-muted-foreground">Active Creators</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">89</div>
              <div className="text-sm text-muted-foreground">Battles Today</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Themes Explored</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
                <Palette className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">PromptClash</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;