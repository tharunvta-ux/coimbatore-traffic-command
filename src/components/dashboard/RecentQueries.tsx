import { Clock } from "lucide-react";
import { PredictionResult } from "@/data/trafficData";

interface QueryLog {
  place: string;
  time: string;
  result: PredictionResult;
  timestamp: Date;
}

const levelBadge: Record<string, string> = {
  HIGH: "bg-destructive/20 text-destructive",
  MEDIUM: "bg-warning/20 text-warning",
  LOW: "bg-success/20 text-success",
};

export default function RecentQueries({ queries }: { queries: QueryLog[] }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Queries</h3>
      </div>
      {queries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No queries yet. Use the Traffic Query panel to search.</p>
      ) : (
        <div className="space-y-2">
          {queries.slice(-10).reverse().map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div>
                <p className="text-sm text-foreground font-medium">{q.place}</p>
                <p className="text-[10px] text-muted-foreground">{q.time} · {q.timestamp.toLocaleTimeString()}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${levelBadge[q.result.traffic_level]}`}>
                {q.result.traffic_level}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
