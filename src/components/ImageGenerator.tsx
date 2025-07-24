import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
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

      toast({
        title: 'Success',
        description: data.description || 'Image generated successfully!',
      });

      // Step 2: Optional — Get user if using Supabase Auth
      let userId = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (e) {
        console.warn('User not logged in or Supabase auth not configured.');
      }

      // Step 3: Save to Supabase
      const { error: dbError } = await supabase.from('generated_images').insert([
        {
          prompt,
          image_data: data.imageData,
          created_at: new Date().toISOString(),
          user_id: userId,
        },
      ]);

      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        toast({
          title: 'Database Error',
          description: 'Image saved locally but failed to store in database.',
          variant: 'destructive',
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
          <Button onClick={generateImage} disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {generatedImage && (
          <div className="mt-4">
            <img
              src={generatedImage}
              alt="Generated AI art"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;
