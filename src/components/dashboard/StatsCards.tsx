import { useEffect, useState } from "react";
import {
  Route,
  MapPin,
  Database,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getStatsAPI } from "@/api/api";

function AnimatedCounter({
  target,
  duration = 1500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

interface StatsData {
  total_roads: number;
  total_places: number;
  total_records: number;
  high_traffic_count: number;
  medium_traffic_count: number;
  low_traffic_count: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    total_roads: 0,
    total_places: 0,
    total_records: 0,
    high_traffic_count: 0,
    medium_traffic_count: 0,
    low_traffic_count: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatsAPI();
        console.log("Stats API:", data);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Roads",
      value: stats.total_roads,
      icon: Route,
      color: "text-primary",
      bg: "bg-primary/10",
      glow: "glow-cyan",
    },
    {
      label: "Total Places",
      value: stats.total_places,
      icon: MapPin,
      color: "text-accent",
      bg: "bg-accent/10",
      glow: "",
    },
    {
      label: "Total Records",
      value: stats.total_records,
      icon: Database,
      color: "text-primary",
      bg: "bg-primary/10",
      glow: "",
    },
    {
      label: "High Traffic Alerts",
      value: stats.high_traffic_count,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      glow: "glow-red",
    },
    {
      label: "Medium Traffic",
      value: stats.medium_traffic_count,
      icon: AlertCircle,
      color: "text-warning",
      bg: "bg-warning/10",
      glow: "glow-orange",
    },
    {
      label: "Low Traffic",
      value: stats.low_traffic_count,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      glow: "glow-green",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 ${card.glow}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}
            >
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>

          <p className={`text-2xl font-bold ${card.color} font-mono`}>
            <AnimatedCounter target={card.value} />
          </p>

          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}