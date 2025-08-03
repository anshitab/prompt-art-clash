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
import JoinCompetition from './pages/JoinCompetition';

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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/demo" element={<Index />} />
              
              {/* Participant-only routes */}
              <Route 
                path="/generate" 
                element={
                  (role === "user" || role === "participant" || !role) ? (
                    <Generate />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                } 
              />
              <Route 
                path="/gallery" 
                element={
                  (role === "user" || role === "participant" || !role) ? (
                    <Gallery />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  (role === "user" || role === "participant" || !role) ? (
                    <Leaderboard />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                } 
              />
              <Route 
                path="/join-competition" 
                element={
                  (role === "user" || role === "participant" || !role) ? (
                    <JoinCompetition />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                } 
              />

              {/* Role selection & protected routes */}
              <Route path="/select-role" element={<RoleSelector />} />
              <Route
                path="/create-battle"
                element={
                  (role === "institute" || role === "host") ? (
                    <CreateBattle />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                }
              />
              <Route
                path="/create-competition"
                element={
                  (role === "institute" || role === "host") ? (
                    <CreateBattle />
                  ) : (
                    <Navigate to="/select-role" />
                  )
                }
              />
              <Route
                path="/participate"
                element={
                  (role === "participant" || role === "user") ? (
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
