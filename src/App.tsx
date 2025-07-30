import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";

// Pages
import Landing from "./pages/Landing";
import Generate from "./pages/Generate";
import Gallery from "./pages/Gallery";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Role-based pages
import RoleSelector from './RoleSelector';
import CreateBattle from './CreateBattle';
import Participate from './Participate';

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Common routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/demo" element={<Index />} />

              {/* Role selection & protected routes */}
              <Route path="/select-role" element={<RoleSelector />} />
              <Route
                path="/create-battle"
                element={
                  role === "institute" ? (
                    <CreateBattle />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                }
              />
              <Route
                path="/participate"
                element={
                  role === "participant" ? (
                    <Participate />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                }
              />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
