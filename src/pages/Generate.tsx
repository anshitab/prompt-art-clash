import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette } from 'lucide-react';
import ImageGenerator from '@/components/ImageGenerator';
import { Navbar } from '@/components/Navbar';

const Generate = () => {
  const todaysTheme = "Cyber Forest";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Theme Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="font-mono">TODAY'S THEME</Badge>
            <h1 className="text-3xl font-bold text-primary">{todaysTheme}</h1>
            <p className="text-muted-foreground">
              Create something amazing with today's theme. Let your creativity flow!
            </p>
          </div>
        </div>
      </div>

      {/* Generator Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Rules Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Submission Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Stay on theme: "{todaysTheme}"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Be creative and original</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>No explicit content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>No offensive material</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Generator */}
          <ImageGenerator />

          {/* Tips Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Be specific with details: "A glowing cyber tree with neon leaves in a dark forest"</p>
              <p>• Include mood and style: "mystical, ethereal, cyberpunk aesthetic"</p>
              <p>• Think about composition: "wide shot", "close-up", "from above"</p>
              <p>• Add artistic elements: "digital art", "concept art", "hyperrealistic"</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generate;