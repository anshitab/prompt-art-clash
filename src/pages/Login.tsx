import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Palette, Mail, Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'participant' | 'host'>('participant');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: `Welcome back ${mode === 'host' ? 'Host' : 'Participant'}!`,
          description: "Successfully logged in to PromptArtClash.",
        });
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">PromptArtClash</span>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <Button
            variant={mode === 'participant' ? 'default' : 'outline'}
            onClick={() => setMode('participant')}
          >
            Participant
          </Button>
          <Button
            variant={mode === 'host' ? 'default' : 'outline'}
            onClick={() => setMode('host')}
          >
            Host
          </Button>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode} // key changes to trigger animation
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <CardHeader className="text-center space-y-2">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {mode === 'participant' ? 'Participant Login' : 'Host Login'}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {mode === 'participant'
                      ? 'Join battles and start creating!'
                      : 'Host battles and manage participants.'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full font-semibold"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : `Sign in as ${mode}`}
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Create Account
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
