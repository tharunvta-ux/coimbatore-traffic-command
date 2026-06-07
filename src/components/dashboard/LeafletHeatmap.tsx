import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// @ts-ignore
import "leaflet.heat";
import { trafficDataset } from "@/data/trafficData";
import { Layers, MapPin, Flame, Eye, EyeOff } from "lucide-react";

// Coimbatore locations with lat/lng
const PLACE_COORDS: Record<string, [number, number]> = {
  "Gandhipuram": [11.0168, 76.9558],
  "RS Puram": [11.0050, 76.9500],
  "Peelamedu": [11.0240, 77.0020],
  "Saibaba Colony": [11.0140, 76.9620],
  "Singanallur": [11.0020, 77.0270],
  "Ukkadam": [10.9920, 76.9610],
  "Town Hall": [11.0010, 76.9620],
  "Sulur": [11.0360, 77.1230],
  "Kuniyamuthur": [10.9630, 76.9550],
  "Vadavalli": [11.0200, 76.9040],
  "Ondipudur": [11.0480, 76.9770],
  "Ganapathy": [11.0320, 76.9570],
  "Rathinapuri": [11.0190, 76.9780],
  "Podanur": [10.9630, 77.0030],
  "Hopes College": [11.0040, 76.9660],
  "Avinashi Road": [11.0230, 77.0100],
  "Mettupalayam Road": [11.0400, 76.9400],
  "Sathyamangalam Road": [11.0380, 76.9700],
  "Trichy Road": [10.9850, 77.0150],
  "Pollachi Road": [10.9500, 76.9300],
  "Brookefields Mall": [11.0150, 77.0200],
  "Fun Republic": [11.0200, 77.0050],
  "Prozone Mall": [11.0520, 76.9830],
  "KMCH Junction": [11.0260, 76.9700],
  "PSG College": [11.0240, 77.0020],
};

function getTrafficLevel(place: string): { level: "HIGH" | "MEDIUM" | "LOW"; highCount: number; total: number } {
  const records = trafficDataset.filter((r) => r.place === place);
  const highCount = records.filter((r) => r.traffic_level === "HIGH").length;
  const total = records.length;
  const level = highCount > total * 0.4 ? "HIGH" : highCount > total * 0.15 ? "MEDIUM" : "LOW";
  return { level: level as any, highCount, total };
}

const levelColor = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#22c55e" };

export default function LeafletHeatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [showHeat, setShowHeat] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [11.0168, 76.9558],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Build heatmap data
    const heatData: [number, number, number][] = [];
    const markersGroup = L.layerGroup();

    Object.entries(PLACE_COORDS).forEach(([place, [lat, lng]]) => {
      const { level, highCount, total } = getTrafficLevel(place);
      const intensity = level === "HIGH" ? 1 : level === "MEDIUM" ? 0.5 : 0.2;

      // Add multiple points around the location for heatmap spread
      for (let i = 0; i < (level === "HIGH" ? 8 : level === "MEDIUM" ? 4 : 2); i++) {
        const offsetLat = (Math.random() - 0.5) * 0.005;
        const offsetLng = (Math.random() - 0.5) * 0.005;
        heatData.push([lat + offsetLat, lng + offsetLng, intensity]);
      }

      // Create marker
      const marker = L.circleMarker([lat, lng], {
        radius: level === "HIGH" ? 10 : level === "MEDIUM" ? 7 : 5,
        fillColor: levelColor[level],
        color: levelColor[level],
        fillOpacity: 0.8,
        weight: 2,
      });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 700;">${place}</h3>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; color: white; background: ${levelColor[level]};">
            ${level} TRAFFIC
          </div>
          <p style="margin: 6px 0 0; font-size: 11px; color: #666;">
            High incidents: ${highCount}/${total} records
          </p>
        </div>
      `);

      markersGroup.addLayer(marker);
    });

    // @ts-ignore
    const heat = L.heatLayer(heatData, {
      radius: 30,
      blur: 20,
      maxZoom: 15,
      max: 1.0,
      gradient: { 0.2: "#22c55e", 0.5: "#f59e0b", 0.8: "#f97316", 1.0: "#ef4444" },
    });

    heat.addTo(map);
    markersGroup.addTo(map);

    mapInstance.current = map;
    heatLayerRef.current = heat;
    markersLayerRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (showHeat && heatLayerRef.current) mapInstance.current.addLayer(heatLayerRef.current);
    else if (heatLayerRef.current) mapInstance.current.removeLayer(heatLayerRef.current);
  }, [showHeat]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (showMarkers && markersLayerRef.current) mapInstance.current.addLayer(markersLayerRef.current);
    else if (markersLayerRef.current) mapInstance.current.removeLayer(markersLayerRef.current);
  }, [showMarkers]);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Interactive Traffic Heatmap</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHeat(!showHeat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showHeat ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"
            }`}
          >
            {showHeat ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Heatmap
          </button>
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showMarkers ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            {showMarkers ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Markers
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute z-[1000] bottom-6 left-6 glass rounded-lg p-3 space-y-1.5" style={{ position: "relative" }}>
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Layers className="w-3 h-3" /> Legend
        </p>
        <div className="flex items-center gap-4">
          {[
            { label: "Low", color: "bg-success" },
            { label: "Medium", color: "bg-warning" },
            { label: "High", color: "bg-destructive" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={mapRef} className="w-full h-[500px]" />
    </div>
  );
}
