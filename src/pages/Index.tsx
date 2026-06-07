import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PoliceDashboard from "./PoliceDashboard";
import CitizenDashboard from "./CitizenDashboard";

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return user?.role === "police" ? <PoliceDashboard /> : <CitizenDashboard />;
}
