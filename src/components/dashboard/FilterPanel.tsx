import { useState } from "react";
import { Filter } from "lucide-react";
import { COIMBATORE_ROADS, TIME_SLOTS, trafficDataset, TrafficRecord } from "@/data/trafficData";

export default function FilterPanel() {
  const [road, setRoad] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [level, setLevel] = useState("");
  const [results, setResults] = useState<TrafficRecord[]>([]);

  const handleFilter = () => {
    let filtered = [...trafficDataset];
    if (road) filtered = filtered.filter((r) => r.road === road);
    if (timeSlot) filtered = filtered.filter((r) => r.time_slot === timeSlot);
    if (level) filtered = filtered.filter((r) => r.traffic_level === level);
    setResults(filtered.slice(0, 50));
  };

  const levelBadge: Record<string, string> = {
    HIGH: "bg-destructive/20 text-destructive",
    MEDIUM: "bg-warning/20 text-warning",
    LOW: "bg-success/20 text-success",
  };

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filter & Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <select value={road} onChange={(e) => setRoad(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none">
          <option value="">All Roads</option>
          {COIMBATORE_ROADS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none">
          <option value="">All Time Slots</option>
          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none">
          <option value="">All Levels</option>
          <option value="HIGH">🔴 High</option>
          <option value="MEDIUM">🟠 Medium</option>
          <option value="LOW">🟢 Low</option>
        </select>
        <button onClick={handleFilter} className="py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
          Apply Filters
        </button>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <p className="text-xs text-muted-foreground mb-2">Showing {results.length} results (max 50)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground">Place</th>
                <th className="text-left py-2 px-2 text-muted-foreground">Road</th>
                <th className="text-left py-2 px-2 text-muted-foreground">Type</th>
                <th className="text-left py-2 px-2 text-muted-foreground">Time</th>
                <th className="text-left py-2 px-2 text-muted-foreground">Level</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/50">
                  <td className="py-2 px-2 text-foreground">{r.place}</td>
                  <td className="py-2 px-2 text-foreground">{r.road}</td>
                  <td className="py-2 px-2 text-muted-foreground">{r.place_type}</td>
                  <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{r.time_slot}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${levelBadge[r.traffic_level]}`}>{r.traffic_level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
