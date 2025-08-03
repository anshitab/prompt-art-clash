import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateBattle = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    start_time: '',
    end_time: '',
    max_participants: 50
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.theme.trim()) {
      setError('Theme is required');
      return false;
    }
    if (!formData.start_time) {
      setError('Start time is required');
      return false;
    }
    if (!formData.end_time) {
      setError('End time is required');
      return false;
    }
    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      setError('End time must be after start time');
      return false;
    }
    if (formData.max_participants < 1 || formData.max_participants > 1000) {
      setError('Max participants must be between 1 and 1000');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create competitions.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('battles')
        .insert([{
          ...formData,
          created_by: user.id,
          status: 'upcoming'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Competition created successfully.',
      });

      // Reset form for creating another competition
      setFormData({
        title: '',
        description: '',
        theme: '',
        start_time: '',
        end_time: '',
        max_participants: 50
      });
    } catch (error: any) {
      console.error('Error creating battle:', error);
      setError(error.message || 'Failed to create competition.');
    } finally {
      setLoading(false);
    }
  };

  const getMinStartDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMinEndDate = () => {
    if (!formData.start_time) return '';
    const startDate = new Date(formData.start_time);
    startDate.setHours(startDate.getHours() + 1); // Minimum 1 hour after start
    return startDate.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Competition
          </h1>
          <p className="text-lg text-muted-foreground">
            Host your own AI art competition and bring together creative minds!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-primary" />
              <span>Competition Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Competition Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Cyberpunk Art Challenge"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="theme">Theme *</Label>
                  <Input
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    placeholder="e.g., Futuristic Cityscapes"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your competition, rules, and what you're looking for..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      min={getMinStartDate()}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      min={getMinEndDate()}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="max_participants">Maximum Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                    min={1}
                    max={1000}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Preview Card */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Preview</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {formData.title || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Theme:</span> {formData.theme || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {
                      formData.start_time && formData.end_time 
                        ? `${new Date(formData.start_time).toLocaleDateString()} - ${new Date(formData.end_time).toLocaleDateString()}`
                        : 'Not set'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Max Participants:</span> {formData.max_participants}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Competition
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBattle;
