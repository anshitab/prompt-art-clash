import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette, Image as ImageIcon } from 'lucide-react';
import ImageGenerator from '@/components/ImageGenerator';
import { Navbar } from '@/components/Navbar';
import cyberForestRef from '@/assets/cyber-forest-reference.jpg';

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
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-muted-foreground text-lg">
                Dive into a world where nature meets technology! Create stunning art that blends organic forest elements with futuristic cyberpunk aesthetics. Think glowing trees, digital foliage, holographic wildlife, and bioluminescent plants in a high-tech environment.
              </p>
              
              {/* Reference Image */}
              <div className="bg-card/50 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center space-x-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Reference Inspiration</span>
                </div>
                <img 
                  src={cyberForestRef} 
                  alt="Cyber Forest Reference" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use this as inspiration for your "{todaysTheme}" prompt. Create your own unique interpretation!
                </p>
              </div>
            </div>
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