export interface TrafficRecord {
  place: string;
  road: string;
  place_type: string;
  time_slot: string;
  traffic_level: "LOW" | "MEDIUM" | "HIGH";
  data_points: number;
}

export interface PredictionResult {
  place: string;
  road: string;
  time_slot: string;
  traffic_level: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  suggestion: string;
  patrol_time: string;
  data_points: number;
}

export const COIMBATORE_PLACES = [
  "Gandhipuram", "RS Puram", "Peelamedu", "Saibaba Colony", "Singanallur",
  "Ukkadam", "Town Hall", "Sulur", "Kuniyamuthur", "Vadavalli",
  "Ondipudur", "Ganapathy", "Rathinapuri", "Podanur", "Hopes College",
  "Avinashi Road", "Mettupalayam Road", "Sathyamangalam Road", "Trichy Road", "Pollachi Road",
  "Brookefields Mall", "Fun Republic", "Prozone Mall", "KMCH Junction", "PSG College",
];

export const COIMBATORE_ROADS = [
  "Avinashi Road", "Sathyamangalam Road", "Mettupalayam Road", "Trichy Road",
  "Thadagam Road", "Pollachi Road", "Nanjundapuram Road", "100 Feet Road",
  "DB Road", "East Arokiasamy Road", "Oppanakara Street", "Big Bazaar Street",
  "Race Course Road", "Kamarajar Road", "NSR Road", "Kalidas Road",
  "Cross Cut Road", "Bharathiar Road", "Cowley Brown Road", "Dr. Nanjappa Road",
];

export const TIME_SLOTS = [
  "6:00 AM - 8:00 AM", "8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM", "8:00 PM - 10:00 PM",
];

export const PLACE_TYPES = [
  "junction", "mall_area", "college_zone", "hospital_zone", "bus_stand",
  "railway_station", "market", "residential", "commercial", "industrial",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function generateRecords(): TrafficRecord[] {
  const records: TrafficRecord[] = [];
  for (const place of COIMBATORE_PLACES) {
    const numRoads = 2 + Math.floor(rand() * 3);
    const roads = [...COIMBATORE_ROADS].sort(() => rand() - 0.5).slice(0, numRoads);
    const placeType = PLACE_TYPES[Math.floor(rand() * PLACE_TYPES.length)];
    for (const road of roads) {
      for (const slot of TIME_SLOTS) {
        const r = rand();
        const isPeak = slot.includes("8:00 AM") || slot.includes("6:00 PM") || slot.includes("4:00 PM");
        const isMall = placeType === "mall_area" || placeType === "commercial";
        let level: "LOW" | "MEDIUM" | "HIGH";
        if (isPeak && isMall) level = r < 0.7 ? "HIGH" : "MEDIUM";
        else if (isPeak) level = r < 0.5 ? "HIGH" : r < 0.85 ? "MEDIUM" : "LOW";
        else if (isMall) level = r < 0.3 ? "HIGH" : r < 0.7 ? "MEDIUM" : "LOW";
        else level = r < 0.15 ? "HIGH" : r < 0.5 ? "MEDIUM" : "LOW";
        records.push({ place, road, place_type: placeType, time_slot: slot, traffic_level: level, data_points: 10 + Math.floor(rand() * 90) });
      }
    }
  }
  return records;
}

export const trafficDataset: TrafficRecord[] = generateRecords();

export function predictTraffic(place: string, timeSlot: string): PredictionResult | null {
  const matches = trafficDataset.filter(
    (r) => r.place.toLowerCase().includes(place.toLowerCase()) && r.time_slot === timeSlot
  );
  if (matches.length === 0) {
    const fuzzy = trafficDataset.filter((r) =>
      r.place.toLowerCase().includes(place.toLowerCase().slice(0, 4))
    );
    if (fuzzy.length === 0) return null;
    const subset = fuzzy.filter((r) => r.time_slot === timeSlot);
    if (subset.length === 0) return null;
    return buildResult(subset);
  }
  return buildResult(matches);
}

function buildResult(matches: TrafficRecord[]): PredictionResult {
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  matches.forEach((m) => counts[m.traffic_level]++);
  const level = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as "LOW" | "MEDIUM" | "HIGH";
  const totalPoints = matches.reduce((s, m) => s + m.data_points, 0);
  const confidence = Math.min(98, 60 + Math.floor(totalPoints / matches.length));
  const suggestions: Record<string, string> = {
    HIGH: "🚨 Deploy traffic officers immediately. Set up diversions.",
    MEDIUM: "⚠️ Monitor area closely. Keep patrol on standby.",
    LOW: "✅ Normal flow. No action needed.",
  };
  const patrolTimes: Record<string, string> = {
    HIGH: "Continuous patrol recommended",
    MEDIUM: "Check every 30 minutes",
    LOW: "Routine patrol sufficient",
  };
  return {
    place: matches[0].place,
    road: matches[0].road,
    time_slot: matches[0].time_slot,
    traffic_level: level,
    confidence,
    suggestion: suggestions[level],
    patrol_time: patrolTimes[level],
    data_points: totalPoints,
  };
}

export function getTopCongestedRoads(n = 10) {
  const roadCounts: Record<string, number> = {};
  trafficDataset.filter((r) => r.traffic_level === "HIGH").forEach((r) => {
    roadCounts[r.road] = (roadCounts[r.road] || 0) + 1;
  });
  return Object.entries(roadCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([road, count]) => ({ road, count, risk: count > 30 ? "CRITICAL" : count > 15 ? "HIGH" : "MODERATE" }));
}

export function getPeakTimeSlots() {
  const slotCounts: Record<string, number> = {};
  trafficDataset.filter((r) => r.traffic_level === "HIGH").forEach((r) => {
    slotCounts[r.time_slot] = (slotCounts[r.time_slot] || 0) + 1;
  });
  return Object.entries(slotCounts).sort((a, b) => b[1] - a[1]).map(([slot, count]) => ({ slot, count }));
}

export function getHighRiskZones() {
  const zones: Record<string, number> = {};
  trafficDataset.filter((r) => r.traffic_level === "HIGH").forEach((r) => {
    const key = `${r.place_type} — ${r.road}`;
    zones[key] = (zones[key] || 0) + 1;
  });
  return Object.entries(zones).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([zone, count]) => ({ zone, count }));
}

export function getTrafficDistribution() {
  const dist = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  trafficDataset.forEach((r) => dist[r.traffic_level]++);
  return dist;
}

export function getTrafficTrendByTime() {
  return TIME_SLOTS.map((slot) => {
    const records = trafficDataset.filter((r) => r.time_slot === slot);
    return {
      slot: slot.split(" - ")[0],
      high: records.filter((r) => r.traffic_level === "HIGH").length,
      medium: records.filter((r) => r.traffic_level === "MEDIUM").length,
      low: records.filter((r) => r.traffic_level === "LOW").length,
    };
  });
}

export function getAlerts() {
  const peakSlots = getPeakTimeSlots().slice(0, 3);
  const topRoads = getTopCongestedRoads(3);
  const alerts = [
    ...peakSlots.map((s) => ({
      type: "warning" as const,
      message: `Peak traffic window detected: ${s.slot}`,
      time: new Date().toLocaleTimeString(),
    })),
    ...topRoads.map((r) => ({
      type: "critical" as const,
      message: `High congestion expected near ${r.road} (${r.count} incidents)`,
      time: new Date().toLocaleTimeString(),
    })),
  ];
  return alerts;
}

export const STATS = {
  totalRoads: new Set(trafficDataset.map((r) => r.road)).size,
  totalPlaces: new Set(trafficDataset.map((r) => r.place)).size,
  totalRecords: trafficDataset.length,
  highAlerts: trafficDataset.filter((r) => r.traffic_level === "HIGH").length,
  mediumTraffic: trafficDataset.filter((r) => r.traffic_level === "MEDIUM").length,
  lowTraffic: trafficDataset.filter((r) => r.traffic_level === "LOW").length,
};
