from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime

# --- Create a SINGLE Flask App ---
app = Flask(__name__)
CORS(app)

# --- Database Connection (created once) ---
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["Envix"]

# --- API Endpoints (all registered on the same 'app') ---

@app.route("/data")
def get_data():
    data = list(db.category.find({}))
    formatted = []
    for d in data:
        formatted.append({
            "latitude": float(d.get("latitude", 0)),
            "longitude": float(d.get("longitude", 0)),
            "type": d.get("info", "")
        })
    return jsonify(formatted)

@app.route("/dashboard_stats")
def dashboard_stats():
    # Total students educated
    pipeline_students = [{"$group": {"_id": None, "total": {"$sum": "$students_educated"}}}]
    result_students = list(db.institutes.aggregate(pipeline_students))
    total_students = result_students[0]["total"] if result_students else 0

    # Total NGOs & Volunteers
    total_ngos = db.ngos.count_documents({})
    total_volunteers = db.volunteers.count_documents({})

    # Current month meals
    now = datetime.now()
    month_start = datetime(now.year, now.month, 1)
    # Correctly handle December
    if now.month == 12:
        month_end = datetime(now.year + 1, 1, 1)
    else:
        month_end = datetime(now.year, now.month + 1, 1)

    pipeline_meals = [
        {"$match": {"date": {"$gte": month_start, "$lt": month_end}}},
        {"$group": {"_id": None, "total": {"$sum": "$count"}}}
    ]
    result_meals = list(db.meal_track.aggregate(pipeline_meals))
    total_meals = result_meals[0]["total"] if result_meals else 0

    return jsonify({
        "students": total_students,
        "ngos": total_ngos,
        "volunteers": total_volunteers,
        "meals": total_meals,
        "currentMonth": now.strftime("%B %Y")
    })

@app.route("/volunteers")
def get_volunteers():
    volunteers = list(db.volunteers.find({}, {"_id": 0}))
    return jsonify(volunteers)

@app.route("/ngos")
def get_ngos():
    ngos = list(db.ngos.find({}, {"_id": 0}))
    return jsonify(ngos)


# --- Run the single app (no threading needed) ---
if __name__ == "__main__":
    # All routes are now served from port 5000
    app.run(debug=True, port=5000)
