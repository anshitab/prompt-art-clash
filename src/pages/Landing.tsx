import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Users, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { PageContainer } from '@/components/layouts/PageContainer';
import techArena from '@/assets/tech-arena.jpg';

const Landing = () => {
  const todaysTheme = "Cyber Forest";
  const livePromptCount = 247; // This would come from real data

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${techArena})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        
        <PageContainer className="relative z-10">
          <div className="text-center element-spacing">
            {/* Main Brand */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-hero leading-tight">
                PromptArtClash
              </h1>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                  Submit your prompt. Watch it come alive.
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-glow" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Enter the ultimate AI art battle arena. Unleash your creativity, compete with masters, and let the community crown the champion.
              </p>
            </div>

            {/* Today's Theme Spotlight */}
            <Card className="max-w-lg mx-auto bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/30 shadow-glow backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <Badge variant="secondary" className="font-mono bg-primary/20 text-primary border-primary/30">
                    LIVE THEME
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-gradient">{todaysTheme}</h3>
                <p className="text-muted-foreground">
                  {livePromptCount} creators are actively participating
                </p>
                <div className="w-full bg-primary/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-3/4 shadow-glow"></div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/generate" className="flex-1">
                <Button size="lg" className="w-full font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-glow transition-all duration-300">
                  <Palette className="w-5 h-5 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/gallery" className="flex-1">
                <Button variant="outline" size="lg" className="w-full font-semibold text-lg px-8 py-6 border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* How It Works Section */}
      <PageContainer className="section-spacing border-t border-border/50">
        <div className="text-center element-spacing">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How PromptArtClash Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Three simple steps to join the creative revolution
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Submit Your Prompt</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enter a creative text prompt based on the daily theme. Let your imagination run wild and craft something unique.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">AI Creates Magic</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our cutting-edge AI transforms your prompt into stunning visual art in seconds. Watch your vision come to life.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Community Votes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The community votes on the best images. Climb the leaderboard and become a legendary prompt artist.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>

      {/* Stats Section */}
      <PageContainer className="section-spacing bg-gradient-to-r from-muted/30 to-background">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground font-medium">Images Generated</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground font-medium">Active Creators</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground font-medium">Battles Today</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground font-medium">Themes Explored</div>
          </div>
        </div>
      </PageContainer>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <PageContainer className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-glow">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg text-gradient">PromptArtClash</span>
                <p className="text-xs text-muted-foreground">AI Art Battle Arena</p>
              </div>
            </div>
            <div className="flex space-x-8 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </PageContainer>
      </footer>
    </AppLayout>
  );
};

export default Landing;