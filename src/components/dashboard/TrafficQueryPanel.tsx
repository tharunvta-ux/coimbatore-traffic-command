import { useState, useEffect } from "react";
import { Search, TrendingUp, Shield, Clock, MapPin, Calendar } from "lucide-react";
import { predictTrafficAPI, getPlacesAPI } from "@/api/api";

interface PredictionResult {
  matched_place: string;
  road_name: string;
  date: string;
  time: string;
  time_slot: string;
  traffic_level: string;
  data_points_used: number;
  confidence: string;
  suggestion: string;
  patrol_time: string;
  match_level: string;
}

interface QueryLog {
  place: string;
  time: string;
  result: PredictionResult;
  timestamp: Date;
}

interface Props {
  onQueryLog?: (log: QueryLog) => void;
}

export default function TrafficQueryPanel({ onQueryLog }: Props) {
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load place list from backend
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlacesAPI();
        setPlaces(data);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      }
    };

    fetchPlaces();
  }, []);

  const handlePredict = async () => {
    if (!place.trim()) {
      setError("Please enter a place name");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    if (!time) {
      setError("Please select a time");
      return;
    }

    setLoading(true);
    setError("");
    console.log("Sending to backend:", { place, date, time });

    try {
      const pred = await predictTrafficAPI(place, date, time);
      setResult(pred);

      onQueryLog?.({
        place,
        time,
        result: pred,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error(err);
      setError("No data found. Try: Gandhipuram, RS Puram, Peelamedu...");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getTrafficLevelColor = (level: string) => {
    if (level.toLowerCase() === "high") return "text-destructive";
    if (level.toLowerCase() === "medium") return "text-warning";
    return "text-success";
  };

  const getTrafficLevelBg = (level: string) => {
    if (level.toLowerCase() === "high") return "bg-destructive/10 border-destructive/30";
    if (level.toLowerCase() === "medium") return "bg-warning/10 border-warning/30";
    return "bg-success/10 border-success/30";
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Advanced Traffic Query</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Place */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Place / Area</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              list="places-list"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Gandhipuram"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <datalist id="places-list">
              {places.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 glow-cyan"
          >
            {loading ? "Analyzing..." : "🔍 Predict Traffic"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}

      {result && (
        <div className={`mt-6 rounded-xl border p-5 ${getTrafficLevelBg(result.traffic_level)} transition-all duration-500`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-foreground">{result.matched_place}</h4>
              <p className="text-xs text-muted-foreground">
                {result.road_name} · {result.time_slot}
              </p>
            </div>
            <div className={`text-2xl font-black ${getTrafficLevelColor(result.traffic_level)}`}>
              {result.traffic_level}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-sm font-bold text-foreground">{result.confidence}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Data Points</p>
                <p className="text-sm font-bold text-foreground">{result.data_points_used}</p>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Suggestion</p>
              <p className="text-sm font-medium text-foreground">{result.suggestion}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border/30 space-y-1">
            <p className="text-xs text-muted-foreground">
              🧭 Patrol: <span className="text-foreground font-medium">{result.patrol_time}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              📌 Match Level: <span className="text-foreground font-medium">{result.match_level}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}