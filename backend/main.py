from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime

# --- Flask App ---
app = Flask(__name__)
# Enable CORS for all routes and all origins
CORS(app, origins="*", methods=["GET","POST","OPTIONS"], allow_headers="*")

# --- MongoDB connection ---
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["Envix"]

# --- Get all category data ---
@app.route("/data")
def get_data():
    try:
        data = list(db.category.find({}))
        formatted = []
        for d in data:
            formatted.append({
                "latitude": float(d.get("latitude", 0)),
                "longitude": float(d.get("longitude", 0)),
                "type": d.get("info", "")
            })
        return jsonify(formatted), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Submit Problem ---
@app.route("/submit_problem", methods=["POST", "OPTIONS"])
def submit_problem():
    if request.method == "OPTIONS":
        # Correct preflight response
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    required_fields = ["latitude", "longitude", "area", "type"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        problem_data = {
            "latitude": float(data["latitude"]),
            "longitude": float(data["longitude"]),
            "area": data["area"],
            "info": data["type"],
            "createdAt": datetime.utcnow()
        }
        db.category.insert_one(problem_data)
        return jsonify({"message": "Problem submitted successfully"}), 201
    except ValueError:
        return jsonify({"error": "Latitude and Longitude must be numbers"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Dashboard stats ---
@app.route("/dashboard_stats")
def dashboard_stats():
    try:
        pipeline_students = [{"$group": {"_id": None, "total": {"$sum": "$students_educated"}}}]
        result_students = list(db.institutes.aggregate(pipeline_students))
        total_students = result_students[0]["total"] if result_students else 0

        total_ngos = db.ngos.count_documents({})
        total_volunteers = db.volunteers.count_documents({})

        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Calculate month end for aggregation
        next_month = month_start.replace(month=month_start.month % 12 + 1, year=month_start.year + (month_start.month // 12))

        pipeline_meals = [
            {"$match": {"date": {"$gte": month_start, "$lt": next_month}}},
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
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Get all volunteers ---
@app.route("/volunteers")
def get_volunteers():
    try:
        volunteers = list(db.volunteers.find({}, {"_id": 0}))
        return jsonify(volunteers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Get all NGOs ---
@app.route("/ngos")
def get_ngos():
    try:
        ngos = list(db.ngos.find({}, {"_id": 0}))
        return jsonify(ngos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Register NGO ---
@app.route("/register_ngo", methods=["POST", "OPTIONS"])
def register_ngo():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    required_fields = ["ngoName", "regId", "contactPerson", "email", "contactNumber", "address", "focusAreas", "description"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400
    
    try:
        ngo_data = {
            "ngoName": data["ngoName"],
            "regId": data["regId"],
            "contactPerson": data["contactPerson"],
            "email": data["email"],
            "contactNumber": data["contactNumber"],
            "address": data["address"],
            "focusAreas": data["focusAreas"],
            "description": data["description"],
            "createdAt": datetime.utcnow()
        }
        db.ngos.insert_one(ngo_data)
        return jsonify({"message": "NGO registration saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Register Volunteer ---
@app.route("/register_volunteer", methods=["POST", "OPTIONS"])
def register_volunteer():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    required_fields = ["fullName", "email", "address", "interests", "availability"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        volunteer_data = {
            "fullName": data["fullName"],
            "email": data["email"],
            "phone": data.get("phone", ""),
            "address": data["address"],
            "interests": data["interests"],
            "availability": data["availability"],
            "createdAt": datetime.utcnow()
        }
        db.volunteers.insert_one(volunteer_data)
        return jsonify({"message": "Volunteer registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Run the app ---
if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
