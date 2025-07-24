import ImageGenerator from '@/components/ImageGenerator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-mono text-sm">AI</span>
              </div>
              <span className="font-mono text-muted-foreground">v2.1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="font-mono">BETA</Badge>
              <Button variant="outline" size="sm">Login</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              🎨✨ Create a Viral AI Art Battle Platform
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Using FastAPI + Image Generation AI!
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Build a fun, competitive, and share-worthy AI art generation platform where users can battle each other using prompts! 
              Each player submits a creative text prompt → The backend generates AI images → Users vote on the better artwork → Leaderboards track wins!
            </p>
          </div>

          {/* Tech Stack */}
          <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🔧 Tech Stack Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">Backend</Badge>
                  <span className="text-muted-foreground">Python (FastAPI) + GitHub Codespaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">Frontend</Badge>
                  <span className="text-muted-foreground">React + Supabase</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">AI</Badge>
                  <span className="text-muted-foreground">DALL·E / Gemini / Stability API</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">Database</Badge>
                  <span className="text-muted-foreground">Supabase PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-card/50 border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🛠️ Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium text-foreground">Prompt Battle Mode</div>
                <div className="text-muted-foreground">2 users battle with AI-generated art</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Voting System</div>
                <div className="text-muted-foreground">Blind voting on better artwork</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Leaderboards</div>
                <div className="text-muted-foreground">Rankings by wins & creativity</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Theme Challenges</div>
                <div className="text-muted-foreground">Weekly themed competitions</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">Social Sharing</div>
                <div className="text-muted-foreground">Branded watermarks & shares</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground">College Hosting</div>
                <div className="text-muted-foreground">Institutional competition management</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <p className="text-muted-foreground italic">
              "AI Art Tinder meets Battleship" — quick, addictive image prompt duels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-semibold">
                Start Battle
              </Button>
              <Button variant="outline" size="lg">
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 py-12 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Try the AI Image Generator</h3>
          <ImageGenerator />
        </div>
      </div>
    </div>
  );
};

export default Index;
