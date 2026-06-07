import { useNavigate } from "react-router-dom";
import { Car, Shield, MapPin, ArrowRight } from "lucide-react";

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-success/3 blur-[150px]" />
      </div>

      <div className="relative w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto glow-cyan">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            🚦 Smart Traffic Prediction
          </h1>
          <p className="text-muted-foreground text-sm">Coimbatore City Traffic Management System</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            System Online · Real-time Monitoring Active
          </div>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Citizen Card */}
          <button
            onClick={() => navigate("/user-login")}
            className="group glass rounded-2xl p-8 text-left transition-all duration-500 hover:scale-[1.03] hover:border-success/50 border border-transparent cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center mb-5 group-hover:bg-success/25 transition-colors">
              <Car className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">👤 Citizen Login</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Check real-time traffic conditions, get predictions for your route, and plan your travel smartly.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" /> Traffic predictions</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" /> Route planning</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" /> Live traffic status</li>
            </ul>
            <div className="flex items-center gap-2 text-success font-semibold text-sm group-hover:gap-3 transition-all">
              Continue as Citizen <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Police Card */}
          <button
            onClick={() => navigate("/police-login")}
            className="group glass rounded-2xl p-8 text-left transition-all duration-500 hover:scale-[1.03] hover:border-primary/50 border border-transparent cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">👮 Police / Admin Login</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Access the full command center with analytics, heatmaps, alerts, and advanced traffic management tools.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Command center</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Interactive heatmap</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Analytics & alerts</li>
            </ul>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
              Continue as Police <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © 2025 Smart Traffic Prediction System · Coimbatore City Police
        </p>
      </div>
    </div>
  );
}
