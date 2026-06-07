import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LoginChoice from "./pages/LoginChoice";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import PoliceLogin from "./pages/PoliceLogin";
import PoliceSignup from "./pages/PoliceSignup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<PublicRoute><LoginChoice /></PublicRoute>} />
            <Route path="/user-login" element={<PublicRoute><UserLogin /></PublicRoute>} />
            <Route path="/user-signup" element={<PublicRoute><UserSignup /></PublicRoute>} />
            <Route path="/police-login" element={<PublicRoute><PoliceLogin /></PublicRoute>} />
            <Route path="/police-signup" element={<PublicRoute><PoliceSignup /></PublicRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
