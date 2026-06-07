import { AlertTriangle, Bell, Info } from "lucide-react";
import { getAlerts } from "@/data/trafficData";

export default function AlertSystem() {
  const alerts = getAlerts();

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Alert Center</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">{alerts.length} Active</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:scale-[1.01] ${
            alert.type === "critical"
              ? "bg-destructive/5 border-destructive/30"
              : "bg-warning/5 border-warning/30"
          }`}>
            {alert.type === "critical" ? (
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              alert.type === "critical" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
            }`}>
              {alert.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
