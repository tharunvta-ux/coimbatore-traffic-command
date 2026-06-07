import { useState } from "react";
import {
  LayoutDashboard, Search, BarChart3, MapPin, AlertTriangle,
  Filter, Clock, User, Bell, LogOut, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "predict", label: "Traffic Query", icon: Search },
  { id: "hotspots", label: "Hotspot Analytics", icon: MapPin },
  { id: "charts", label: "Charts & Trends", icon: BarChart3 },
  { id: "heatmap", label: "Heatmap View", icon: MapPin },
  { id: "alerts", label: "Alert Center", icon: AlertTriangle },
  { id: "filters", label: "Filter & Analysis", icon: Filter },
  { id: "recent", label: "Recent Queries", icon: Clock },
];

export default function PoliceSidebar({ activeSection, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside className={`${collapsed ? "w-[72px]" : "w-64"} min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-foreground tracking-wide">SMART TRAFFIC</h2>
            <p className="text-[10px] text-muted-foreground tracking-widest">COIMBATORE POLICE</p>
          </div>
        )}
      </div>

      {/* Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{user?.name || "Officer"}</p>
              <p className="text-[10px] text-muted-foreground">Badge #{user?.badgeId || "TCU-0000"}</p>
              <p className="text-[10px] text-primary">Traffic Control Unit</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
              ${activeSection === item.id
                ? "bg-primary/15 text-primary font-medium glow-cyan"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
          >
            <item.icon className={`w-4 h-4 shrink-0 ${activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
