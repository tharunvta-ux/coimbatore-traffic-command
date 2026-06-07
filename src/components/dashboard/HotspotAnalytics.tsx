import { useEffect, useState } from "react";
import { Flame, Clock, MapPin } from "lucide-react";
import { getHotspotsAPI } from "@/api/api";

const riskColors: Record<string, string> = {
  CRITICAL: "bg-destructive/20 text-destructive border-destructive/40",
  HIGH: "bg-warning/20 text-warning border-warning/40",
  MODERATE: "bg-primary/20 text-primary border-primary/40",
};

interface CongestedRoad {
  road_name: string;
  high_traffic_count: number;
}

interface PeakSlot {
  time_slot: string;
  count: number;
}

interface TrafficDistribution {
  traffic_level: string;
  count: number;
}

export default function HotspotAnalytics() {
  const [roads, setRoads] = useState<CongestedRoad[]>([]);
  const [peaks, setPeaks] = useState<PeakSlot[]>([]);
  const [distribution, setDistribution] = useState<TrafficDistribution[]>([]);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const data = await getHotspotsAPI();
        console.log("Hotspots API:", data);

        setRoads(data.top_congested_roads || []);
        setPeaks(data.peak_time_slots || []);
        setDistribution(data.traffic_distribution || []);
      } catch (err) {
        console.error("Failed to fetch hotspot analytics:", err);
      }
    };

    fetchHotspots();
  }, []);

  const getRiskLevel = (count: number) => {
    if (count > 10000) return "CRITICAL";
    if (count > 5000) return "HIGH";
    return "MODERATE";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Congested Roads */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-destructive" />
          <h3 className="text-sm font-bold text-foreground">Top 10 Congested Roads</h3>
        </div>

        <div className="space-y-2">
          {roads.length > 0 ? (
            roads.map((r, i) => {
              const risk = getRiskLevel(r.high_traffic_count);

              return (
                <div
                  key={r.road_name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                    <span className="text-sm text-foreground">{r.road_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {r.high_traffic_count}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${riskColors[risk]}`}
                    >
                      {risk}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No congested road data available.</p>
          )}
        </div>
      </div>

      {/* Peak Time Slots */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-warning" />
          <h3 className="text-sm font-bold text-foreground">Peak Traffic Time Slots</h3>
        </div>

        <div className="space-y-2">
          {peaks.length > 0 ? (
            peaks.map((p, i) => {
              const maxCount = peaks[0].count || 1;
              const width = (p.count / maxCount) * 100;

              return (
                <div key={p.time_slot} className="py-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{p.time_slot}</span>
                    <span className="text-muted-foreground font-mono">
                      {p.count} incidents
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${width}%`,
                        background:
                          i === 0
                            ? "hsl(0 72% 51%)"
                            : i < 3
                            ? "hsl(38 92% 50%)"
                            : "hsl(187 85% 53%)",
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No peak time slot data available.</p>
          )}
        </div>
      </div>

      {/* Traffic Distribution */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Traffic Distribution</h3>
        </div>

        <div className="space-y-3">
          {distribution.length > 0 ? (
            distribution.map((d) => (
              <div
                key={d.traffic_level}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <span className="text-sm text-foreground capitalize">
                  {d.traffic_level}
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  {d.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No traffic distribution data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}