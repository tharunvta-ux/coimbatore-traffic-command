import { useState, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PoliceSidebar from "@/components/PoliceSidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import TrafficQueryPanel from "@/components/dashboard/TrafficQueryPanel";
import HotspotAnalytics from "@/components/dashboard/HotspotAnalytics";
import TrafficCharts from "@/components/dashboard/TrafficCharts";
import AlertSystem from "@/components/dashboard/AlertSystem";
import RecentQueries from "@/components/dashboard/RecentQueries";
import FilterPanel from "@/components/dashboard/FilterPanel";
import { PredictionResult } from "@/data/trafficData";
import { Bell, Radio, Loader2 } from "lucide-react";

const LeafletHeatmap = lazy(() => import("@/components/dashboard/LeafletHeatmap"));

interface QueryLog {
  place: string;
  time: string;
  result: PredictionResult;
  timestamp: Date;
}

const sectionTitles: Record<string, string> = {
  overview: "Command Center Overview",
  predict: "Traffic Prediction Engine",
  hotspots: "Hotspot Analytics",
  charts: "Charts & Visualization",
  heatmap: "Interactive Traffic Heatmap",
  alerts: "Alert Center",
  filters: "Filter & Analysis Tools",
  recent: "Recent Queries Log",
};

export default function PoliceDashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState("overview");
  const [queries, setQueries] = useState<QueryLog[]>([]);

  const addQuery = (log: QueryLog) => setQueries((prev) => [...prev, log]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <PoliceSidebar activeSection={section} onNavigate={setSection} />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 glass border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">{sectionTitles[section]}</h1>
            <p className="text-xs text-muted-foreground">🚦 Smart Traffic Prediction System – Coimbatore</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-success">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>System Online</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {section === "overview" && (
            <>
              <StatsCards />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <TrafficQueryPanel onQueryLog={addQuery} />
                </div>
                <AlertSystem />
              </div>
              <HotspotAnalytics />
              <TrafficCharts />
            </>
          )}
          {section === "predict" && <TrafficQueryPanel onQueryLog={addQuery} />}
          {section === "hotspots" && <HotspotAnalytics />}
          {section === "charts" && <TrafficCharts />}
          {section === "heatmap" && (
            <Suspense fallback={<div className="flex items-center justify-center h-96 glass rounded-xl"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
              <LeafletHeatmap />
            </Suspense>
          )}
          {section === "alerts" && <AlertSystem />}
          {section === "filters" && <FilterPanel />}
          {section === "recent" && <RecentQueries queries={queries} />}
        </div>
      </main>
    </div>
  );
}
