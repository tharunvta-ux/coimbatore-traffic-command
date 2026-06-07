const BASE_URL = "http://127.0.0.1:5000";

// ==========================
// PREDICT TRAFFIC
// ==========================
export const predictTrafficAPI = async (place: string, date: string, time: string) => {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ place, date, time }),
  });

  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
};

// ==========================
// GET PLACES
// ==========================
export const getPlacesAPI = async () => {
  const res = await fetch(`${BASE_URL}/api/places`);
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
};

// ==========================
// GET STATS
// ==========================
export const getStatsAPI = async () => {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

// ==========================
// GET HOTSPOTS
// ==========================
export const getHotspotsAPI = async () => {
  const res = await fetch(`${BASE_URL}/api/hotspots`);
  if (!res.ok) throw new Error("Failed to fetch hotspots");
  return res.json();
};