import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Search, MapPin, Car, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { predictTrafficAPI, getPlacesAPI } from "@/api/api";

export default function CitizenDashboard() {
  const { user, logout } = useAuth();

  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  // Load places from backend
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlacesAPI();
        setPlaces(data);
      } catch (err) {
        console.error("Failed to load places", err);
      }
    };
    fetchPlaces();
  }, []);

  const handlePredict = async () => {
    if (!place || !date || !time) {
      alert("Please enter place, date and time");
      return;
    }

    try {
      const res = await predictTrafficAPI(place, date, time);
      console.log("API RESPONSE:", res);
      setResult(res);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setResult(null);
      setSearched(true);
    }
  };

  const getColor = (level: string) => {
    if (level?.toLowerCase() === "high") return "text-red-500";
    if (level?.toLowerCase() === "medium") return "text-yellow-500";
    return "text-green-500";
  };

  const getBg = (level: string) => {
    if (level?.toLowerCase() === "high") return "bg-red-500/10 border-red-500/30";
    if (level?.toLowerCase() === "medium") return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-green-500/10 border-green-500/30";
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Car className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">🚦 Traffic Info Portal</h1>
            <p className="text-[10px] text-muted-foreground">Coimbatore · Citizen View</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-green-500">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Live</span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Hi, {user?.name}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* FORM */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Check Traffic Conditions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

            {/* PLACE */}
            <div>
              <label className="text-xs text-muted-foreground">Place</label>
              <input
                list="places"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-secondary"
                placeholder="Enter place"
              />
              <datalist id="places">
                {places.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            {/* DATE */}
            <div>
              <label className="text-xs text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-secondary"
              />
            </div>

            {/* TIME */}
            <div>
              <label className="text-xs text-muted-foreground">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-secondary"
              />
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <Button
                onClick={handlePredict}
                className="w-full bg-green-500 text-white"
              >
                🔍 Check Traffic
              </Button>
            </div>

          </div>
        </div>

        {/* RESULT */}
        {searched && result && (
          <div className={`rounded-xl p-6 border ${getBg(result.traffic_level)}`}>
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">{result.matched_place}</h3>
              <span className={`font-bold ${getColor(result.traffic_level)}`}>
                {result.traffic_level}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>Road: {result.road_name}</div>
              <div>Time Slot: {result.time_slot}</div>
              <div>Confidence: {result.confidence}</div>
              <div>Data Points: {result.data_points_used}</div>
            </div>

            <p className="mt-4 text-sm">{result.suggestion}</p>
            <p className="text-xs mt-2">Patrol: {result.patrol_time}</p>
          </div>
        )}

        {/* NO RESULT */}
        {searched && !result && (
          <p className="text-center text-muted-foreground">
            No data found for "{place}"
          </p>
        )}

      </div>
    </div>
  );
}