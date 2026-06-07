import { MapPin } from "lucide-react";
import { COIMBATORE_PLACES, TIME_SLOTS, trafficDataset } from "@/data/trafficData";

const levelColor = { HIGH: "bg-destructive/70", MEDIUM: "bg-warning/60", LOW: "bg-success/50" };
const levelText = { HIGH: "H", MEDIUM: "M", LOW: "L" };

export default function HeatmapGrid() {
  const places = COIMBATORE_PLACES.slice(0, 12);
  const slots = TIME_SLOTS;

  function getLevel(place: string, slot: string) {
    const records = trafficDataset.filter((r) => r.place === place && r.time_slot === slot);
    if (records.length === 0) return null;
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    records.forEach((r) => counts[r.traffic_level]++);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as "HIGH" | "MEDIUM" | "LOW";
  }

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Traffic Heatmap – Coimbatore</h3>
      </div>
      <div className="flex gap-4 mb-4">
        {(["HIGH", "MEDIUM", "LOW"] as const).map((l) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${levelColor[l]}`} />
            <span className="text-xs text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium sticky left-0 bg-card">Place</th>
              {slots.map((s) => (
                <th key={s} className="text-center py-2 px-1 text-muted-foreground font-medium whitespace-nowrap">{s.split(" - ")[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place} className="border-t border-border/30">
                <td className="py-2 px-2 text-foreground font-medium sticky left-0 bg-card whitespace-nowrap">{place}</td>
                {slots.map((slot) => {
                  const level = getLevel(place, slot);
                  return (
                    <td key={slot} className="py-2 px-1 text-center">
                      {level ? (
                        <div className={`w-8 h-8 mx-auto rounded-md ${levelColor[level]} flex items-center justify-center text-[10px] font-bold text-foreground transition-all hover:scale-110`}>
                          {levelText[level]}
                        </div>
                      ) : (
                        <div className="w-8 h-8 mx-auto rounded-md bg-secondary/30 flex items-center justify-center text-muted-foreground">—</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
