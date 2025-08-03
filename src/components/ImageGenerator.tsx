import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Sparkles, Upload } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Call FastAPI backend
      const response = await fetch('http://localhost:8000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.imageData) {
        throw new Error(data.error || 'Image generation failed.');
      }

      const base64Image = `data:image/png;base64,${data.imageData}`;
      setGeneratedImage(base64Image);

      console.log('Generated image data length:', data.imageData.length);
      console.log('Base64 image URL length:', base64Image.length);

      toast({
        title: 'Success',
        description: data.description || 'Image generated successfully!',
      });

      // Step 2: Get user if using Supabase Auth
      let userId = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (e) {
        console.warn('User not logged in or Supabase auth not configured.');
      }

      // Step 3: Save to Supabase submissions table
      const { error: dbError } = await supabase.from('submissions').insert([
        {
          prompt,
          image_url: base64Image,
          user_id: userId ? parseInt(userId) : null,
        },
      ]);

      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        toast({
          title: 'Database Error',
          description: 'Image saved locally but failed to store in database.',
          variant: 'destructive',
        });
      } else {
        console.log('Image saved successfully to database');
        toast({
          title: 'Saved',
          description: 'Image has been saved to the gallery!',
        });
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
          } finally {
        setLoading(false);
      }
    };

  const submitToCompetition = async () => {
    if (!generatedImage) {
      toast({
        title: 'Error',
        description: 'No image to submit. Please generate an image first.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get user if using Supabase Auth
      let userId = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (e) {
        console.warn('User not logged in or Supabase auth not configured.');
      }

      // Save to Supabase submissions table
      const { error: dbError } = await supabase.from('submissions').insert([
        {
          prompt,
          image_url: generatedImage,
          user_id: userId ? parseInt(userId) : null,
        },
      ]);

      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        toast({
          title: 'Submission Error',
          description: 'Failed to submit to competition. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Image submitted successfully to competition');
        toast({
          title: 'Submitted!',
          description: 'Your artwork has been submitted to the competition!',
        });
        
        // Reset form after successful submission
        setPrompt('');
        setGeneratedImage(null);
      }
    } catch (error: any) {
      console.error('Error submitting to competition:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit to competition.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your prompt (e.g. cat surfing on lava)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <Button onClick={generateImage} disabled={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        {generatedImage && (
          <div className="mt-4 space-y-4">
            <img
              src={generatedImage}
              alt="Generated AI art"
              className="w-full rounded-lg shadow-lg"
            />
            
            {/* Submit to Competition Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Submit to Competition</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submit your artwork to the current competition
                  </p>
                </div>
                <Button 
                  onClick={submitToCompetition} 
                  disabled={submitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Submit to Competition
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;
