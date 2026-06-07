import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PoliceSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !badgeId) { setError("Please fill all fields"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    signup(name, email, password, "police", badgeId);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="relative glass rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto glow-cyan">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Police Registration</h1>
          <p className="text-sm text-muted-foreground">Register for Command Center access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <Input placeholder="Officer name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Badge / ID Number</label>
            <Input placeholder="TCU-XXXX" value={badgeId} onChange={(e) => setBadgeId(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Official Email</label>
            <Input type="email" placeholder="officer@police.gov" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50 border-border pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold glow-cyan">Register Police Account</Button>
        </form>

        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>Already registered? <Link to="/police-login" className="text-primary hover:underline font-medium">Sign In</Link></p>
          <p><Link to="/login" className="text-muted-foreground hover:text-foreground">← Back to selection</Link></p>
        </div>
      </div>
    </div>
  );
}
