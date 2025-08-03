import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette, Image as ImageIcon, Lightbulb, Target } from 'lucide-react';
import ImageGenerator from '@/components/ImageGenerator';
import { AppLayout } from '@/components/layouts/AppLayout';
import { PageHeader } from '@/components/layouts/PageHeader';
import { PageContainer } from '@/components/layouts/PageContainer';
import cyberForestRef from '@/assets/cyber-forest-reference.jpg';

const Generate = () => {
  const todaysTheme = "Cyber Forest";

  return (
    <AppLayout>
      <PageHeader 
        title="Create Art" 
        description="Transform your imagination into stunning AI-generated art with today's theme."
      >
        {/* Today's Theme Section */}
        <div className="mt-8">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-glow">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <Badge variant="secondary" className="font-mono text-sm">TODAY'S THEME</Badge>
                </div>
                <h2 className="text-3xl font-bold text-gradient">{todaysTheme}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Dive into a world where nature meets technology! Create stunning art that blends organic forest elements with futuristic cyberpunk aesthetics.
                </p>
                
                {/* Reference Image */}
                <div className="bg-card/50 rounded-xl p-4 border border-primary/10 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Reference Inspiration</span>
                  </div>
                  <img 
                    src={cyberForestRef} 
                    alt="Cyber Forest Reference" 
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Use this as inspiration for your "{todaysTheme}" prompt. Create your own unique interpretation!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageHeader>

      <PageContainer className="section-spacing">
        <div className="element-spacing">
          {/* Guidelines Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Stay On Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Incorporate elements of "{todaysTheme}" into your artwork for the best competition results.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 dark:text-green-400">Required for judging</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>Be Creative</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Original and innovative interpretations score higher in community voting.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-600 dark:text-blue-400">Encouraged</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Palette className="w-5 h-5 text-primary" />
                  <span>Quality First</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No explicit content, offensive material, or low-effort submissions.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 dark:text-red-400">Prohibited</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Generator */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">AI Art Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGenerator />
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Lightbulb className="w-6 h-6" />
                <span>Pro Tips for Better Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Prompt Structure</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="text-foreground">Subject:</span> "A glowing cyber tree with neon leaves"</li>
                  <li>• <span className="text-foreground">Setting:</span> "in a dark mystical forest"</li>
                  <li>• <span className="text-foreground">Style:</span> "cyberpunk aesthetic, digital art"</li>
                  <li>• <span className="text-foreground">Details:</span> "ethereal lighting, high contrast"</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Technical Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use specific composition terms: "wide shot", "close-up", "bird's eye view"</li>
                  <li>• Add quality modifiers: "hyperrealistic", "concept art", "8K resolution"</li>
                  <li>• Include mood descriptors: "mysterious", "vibrant", "atmospheric"</li>
                  <li>• Specify lighting: "soft ambient", "dramatic shadows", "neon glow"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppLayout>
  );
};

export default Generate;