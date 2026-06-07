from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from difflib import get_close_matches
from datetime import datetime

app = Flask(__name__)
CORS(app)

# =========================
# LOAD DATA
# =========================
traffic_df = pd.read_csv("traffic_dataset.csv")
places_df = pd.read_csv("places_final.csv")
mapping_df = pd.read_csv("place_road_mapping_best.csv")

# =========================
# CLEAN DATA
# =========================
traffic_df.columns = traffic_df.columns.str.strip().str.lower()
places_df.columns = places_df.columns.str.strip().str.lower()
mapping_df.columns = mapping_df.columns.str.strip().str.lower()

traffic_df["road_name"] = traffic_df["road_name"].astype(str).str.strip().str.lower()
traffic_df["nearby_place_type"] = traffic_df["nearby_place_type"].astype(str).str.strip().str.lower()
traffic_df["time_slot"] = traffic_df["time_slot"].astype(str).str.strip().str.lower()
traffic_df["day_of_week"] = traffic_df["day_of_week"].astype(str).str.strip().str.lower()
traffic_df["date"] = traffic_df["date"].astype(str).str.strip()
traffic_df["time"] = traffic_df["time"].astype(str).str.strip()

places_df["name"] = places_df["name"].astype(str).str.strip().str.lower()
places_df["place_type"] = places_df["place_type"].astype(str).str.strip().str.lower()

mapping_df["place"] = mapping_df["place"].astype(str).str.strip().str.lower()
mapping_df["road_name"] = mapping_df["road_name"].astype(str).str.strip().str.lower()

# =========================
# HELPER FUNCTIONS
# =========================
def get_time_slot(hour):
    if 6 <= hour < 10:
        return "morning_peak"
    elif 10 <= hour < 13:
        return "mid_morning"
    elif 13 <= hour < 17:
        return "afternoon"
    elif 17 <= hour < 21:
        return "evening_peak"
    elif 21 <= hour < 24:
        return "night"
    else:
        return "late_night"

def get_day_info(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    day_of_week = dt.strftime("%A").lower()
    is_weekend = 1 if day_of_week in ["saturday", "sunday"] else 0
    return day_of_week, is_weekend

def fuzzy_match_place(user_place):
    user_place = user_place.strip().lower()
    all_places = places_df["name"].tolist()
    match = get_close_matches(user_place, all_places, n=1, cutoff=0.5)
    return match[0] if match else None

def get_suggestion(level):
    if level == "high":
        return "Heavy congestion expected. Consider alternate route."
    elif level == "medium":
        return "Moderate traffic expected. Start a little earlier."
    else:
        return "Traffic likely smooth."

def get_patrol_time(level, time_slot):
    if level == "high":
        return f"Recommended patrol around {time_slot}"
    elif level == "medium":
        return f"Monitor traffic during {time_slot}"
    else:
        return "No special patrol required"

# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Smart Traffic Prediction Backend Running"
    })

@app.route("/api/places", methods=["GET"])
def get_places():
    places = sorted(places_df["name"].dropna().unique().tolist())
    return jsonify(places)

@app.route("/api/predict", methods=["POST"])
def predict_traffic():
    try:
        data = request.get_json()

        user_place = data.get("place", "").strip()
        user_date = data.get("date", "").strip()
        user_time = data.get("time", "").strip()

        if not user_place or not user_date or not user_time:
            return jsonify({"error": "place, date, and time are required"}), 400

        # Fuzzy match place
        matched_place = fuzzy_match_place(user_place)
        if not matched_place:
            return jsonify({"error": "No matching place found"}), 404

        # Get place type
        place_row = places_df[places_df["name"] == matched_place]
        if place_row.empty:
            return jsonify({"error": "Place type not found"}), 404
        place_type = place_row.iloc[0]["place_type"]

        # Get mapped road
        road_row = mapping_df[mapping_df["place"] == matched_place]
        if road_row.empty:
            return jsonify({"error": "No mapped road found"}), 404
        road_name = road_row.iloc[0]["road_name"]

        # Time slot + date info
        hour = int(user_time.split(":")[0])
        time_slot = get_time_slot(hour)
        day_of_week, is_weekend = get_day_info(user_date)

        # =========================
        # FALLBACK MATCHING LOGIC
        # =========================

        # Level 1: full match
        result = traffic_df[
            (traffic_df["road_name"] == road_name) &
            (traffic_df["time_slot"] == time_slot) &
            (traffic_df["day_of_week"] == day_of_week) &
            (traffic_df["is_weekend"] == is_weekend) &
            (traffic_df["nearby_place_type"] == place_type)
        ]
        match_level = "full match"

        # Level 2: ignore place_type
        if result.empty:
            result = traffic_df[
                (traffic_df["road_name"] == road_name) &
                (traffic_df["time_slot"] == time_slot) &
                (traffic_df["day_of_week"] == day_of_week) &
                (traffic_df["is_weekend"] == is_weekend)
            ]
            match_level = "fallback: ignored place type"

        # Level 3: road + time_slot
        if result.empty:
            result = traffic_df[
                (traffic_df["road_name"] == road_name) &
                (traffic_df["time_slot"] == time_slot)
            ]
            match_level = "fallback: road + time slot"

        # Level 4: road only
        if result.empty:
            result = traffic_df[
                (traffic_df["road_name"] == road_name)
            ]
            match_level = "fallback: road only"

        if result.empty:
            return jsonify({"error": "No traffic data found"}), 404

        traffic_level = result["traffic_level"].mode()[0]
        data_points_used = len(result)

        confidence_map = {
            "full match": "High",
            "fallback: ignored place type": "Medium",
            "fallback: road + time slot": "Medium",
            "fallback: road only": "Low"
        }

        response = {
            "matched_place": matched_place.title(),
            "road_name": road_name.title(),
            "date": user_date,
            "time": user_time,
            "time_slot": time_slot,
            "traffic_level": traffic_level.title(),
            "data_points_used": int(data_points_used),
            "confidence": confidence_map.get(match_level, "Low"),
            "suggestion": get_suggestion(traffic_level),
            "patrol_time": get_patrol_time(traffic_level, time_slot),
            "match_level": match_level
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        stats = {
            "total_roads": int(traffic_df["road_name"].nunique()),
            "total_places": int(places_df["name"].nunique()),
            "total_records": int(len(traffic_df)),
            "high_traffic_count": int((traffic_df["traffic_level"] == "high").sum()),
            "medium_traffic_count": int((traffic_df["traffic_level"] == "medium").sum()),
            "low_traffic_count": int((traffic_df["traffic_level"] == "low").sum())
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/hotspots", methods=["GET"])
def get_hotspots():
    try:
        # Normalize traffic levels
        traffic_df["traffic_level"] = traffic_df["traffic_level"].astype(str).str.lower().str.strip()

        # Include BOTH high + very high
        high_df = traffic_df[
            traffic_df["traffic_level"].isin(["high", "very high"])
        ]

        # Top congested roads
        top_roads = (
            high_df["road_name"]
            .value_counts()
            .head(10)
            .reset_index()
        )
        top_roads.columns = ["road_name", "high_traffic_count"]

        # Peak time slots
        peak_slots = (
            high_df["time_slot"]
            .value_counts()
            .reset_index()
        )
        peak_slots.columns = ["time_slot", "count"]

        # Traffic distribution (clean labels)
        distribution = (
            traffic_df["traffic_level"]
            .value_counts()
            .reset_index()
        )
        distribution.columns = ["traffic_level", "count"]

        return jsonify({
            "top_congested_roads": top_roads.to_dict(orient="records"),
            "peak_time_slots": peak_slots.to_dict(orient="records"),
            "traffic_distribution": distribution.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)