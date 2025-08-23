from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
import uuid

# --- Flask App ---
app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "PUT", "OPTIONS"], allow_headers="*")

# --- MongoDB connection ---
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["Envix"]

# ---------------------------
# CATEGORY / MAP DATA
# ---------------------------
@app.route("/data")
def get_category_data():
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

# ---------------------------
# VOLUNTEERS
# ---------------------------
@app.route("/volunteers", methods=["GET"])
def get_volunteers():
    try:
        volunteers = list(db.volunteers.find({"status": "active"}))
        formatted = []
        for v in volunteers:
            formatted.append({
                "fullName": v.get("fullName", "N/A"),
                "email": v.get("email", "N/A"),
                "phone": v.get("phone", "N/A"),
                "city": v.get("city", "N/A"),
                "interests": v.get("interests", []),
                "availability": v.get("availability", "N/A"),
                "status": v.get("status", "N/A"),
                "registration_date": v.get("registration_date", "")
            })
        return jsonify(formatted), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/volunteers", methods=["POST"])
def add_volunteer():
    try:
        data = request.json
        db.volunteers.insert_one({
            "fullName": data.get("fullName"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "city": data.get("city"),
            "interests": data.get("interests", []),
            "availability": data.get("availability"),
            "status": "active",
            "registration_date": datetime.utcnow().isoformat()
        })
        return jsonify({"message": "Volunteer added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# NGOs
# ---------------------------
@app.route("/ngos", methods=["GET"])
def get_ngos():
    try:
        ngos = list(db.ngos.find({"status": "verified"}))
        formatted = []
        for n in ngos:
            formatted.append({
                "_id": str(n.get("_id")),
                "ngoName": n.get("ngoName") or n.get("name", "N/A"),
                "registration_id": n.get("registration_id", "N/A"),
                "contactPerson": n.get("contactPerson") or n.get("contact_person", "N/A"),
                "email": n.get("email", "N/A"),
                "phone": n.get("phone", "N/A"),
                "operationArea": n.get("operationArea") or n.get("operation_area", "N/A"),
                "focusAreas": n.get("focusAreas") or n.get("focus_areas", []),
                "description": n.get("description", ""),
                "status": n.get("status", "pending_verification"),
                "registration_date": n.get("registration_date", "")
            })
        return jsonify(formatted), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ngos/pending", methods=["GET"])
def get_pending_ngos():
    try:
        ngos = list(db.ngos.find({"status": "pending_verification"}))
        formatted = []
        for n in ngos:
            formatted.append({
                "_id": str(n.get("_id")),
                "name": n.get("ngoName") or n.get("name", "N/A"),
                "registration_id": n.get("registration_id", "N/A"),
                "contact_person": n.get("contactPerson") or n.get("contact_person", "N/A"),
                "email": n.get("email", "N/A"),
                "phone": n.get("phone", "N/A"),
                "operation_area": n.get("operationArea") or n.get("operation_area", "N/A"),
                "focus_areas": n.get("focusAreas") or n.get("focus_areas", []),
                "description": n.get("description", ""),
                "status": n.get("status", "pending_verification"),
                "registration_date": n.get("registration_date", "")
            })
        return jsonify(formatted), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ngos", methods=["POST"])
def add_ngo():
    try:
        data = request.json
        db.ngos.insert_one({
            "ngoName": data.get("ngoName"),
            "registration_id": data.get("registration_id"),
            "contactPerson": data.get("contactPerson"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "operationArea": data.get("operationArea"),
            "focusAreas": data.get("focusAreas", []),
            "description": data.get("description", ""),
            "status": data.get("status", "pending_verification"),
            "registration_date": datetime.utcnow().isoformat()
        })
        return jsonify({"message": "NGO added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ngos/verify/<ngo_id>", methods=["PUT"])
def update_ngo_status(ngo_id):
    try:
        data = request.json
        new_status = data.get("status", "pending_verification")
        result = db.ngos.update_one(
            {"_id": ObjectId(ngo_id)},
            {"$set": {"status": new_status}}
        )
        if result.modified_count == 0:
            return jsonify({"error": "No NGO found or status unchanged"}), 404
        return jsonify({"message": f"NGO status updated to {new_status}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ngo/<ngo_id>", methods=["GET"])
def get_single_ngo(ngo_id):
    try:
        ngo = db.ngos.find_one({"_id": ObjectId(ngo_id)})
        if not ngo:
            return jsonify({"error": "NGO not found"}), 404
        formatted = {
            "_id": str(ngo.get("_id")),
            "ngoName": ngo.get("ngoName", "N/A"),
            "registration_id": ngo.get("registration_id", "N/A"),
            "contactPerson": ngo.get("contactPerson", "N/A"),
            "email": ngo.get("email", "N/A"),
            "phone": ngo.get("phone", "N/A"),
            "operationArea": ngo.get("operationArea", "N/A"),
            "focusAreas": ngo.get("focusAreas", []),
            "description": ngo.get("description", ""),
            "status": ngo.get("status", "pending_verification"),
            "registration_date": ngo.get("registration_date", "")
        }
        return jsonify(formatted), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# DASHBOARD
# ---------------------------
@app.route("/dashboard_stats")
def dashboard_stats():
    try:
        total_volunteers = db.volunteers.count_documents({"status": "active"})
        total_ngos = db.ngos.count_documents({"status": "verified"})
        return jsonify({
            "volunteers": total_volunteers,
            "ngos": total_ngos
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# LOGIN (email only)
# ---------------------------
@app.route("/login", methods=["POST"])
def login_email_only():
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()

        if not email:
            return jsonify({"message": "Email is required"}), 400

        # Admin login
        admin = db.admins.find_one({"email": email})
        if admin:
            return jsonify({
                "role": "admin",
                "id": str(admin.get("_id")),
                "name": admin.get("name", "Admin")
            }), 200

        # NGO login
        ngo = db.ngos.find_one({"email": email})
        if ngo:
            return jsonify({
                "role": "ngo",
                "id": str(ngo.get("_id")),
                "ngoName": ngo.get("ngoName") or ngo.get("name", "NGO")
            }), 200

        return jsonify({"message": "Email not found"}), 404

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"message": "Internal server error"}), 500

# ---------------------------
# API KEYS (per NGO)
# ---------------------------
@app.route("/generate_api_key/<ngo_id>", methods=["POST"])
def generate_api_key(ngo_id):
    try:
        try:
            obj_id = ObjectId(ngo_id)
        except:
            return jsonify({"error": "Invalid NGO ID format"}), 400

        ngo = db.ngos.find_one({"_id": obj_id})
        if not ngo:
            return jsonify({"error": "NGO not found"}), 404

        # Check if API key already exists
        api_record = db.api.find_one({"ngo_id": str(ngo["_id"])})
        if api_record:
            return jsonify({"message": "API key already exists", "api_key": api_record["api_key"]}), 200

        # Generate new API key
        api_key = str(uuid.uuid4())
        db.api.update_one(
            {"ngo_id": str(ngo["_id"])},
            {"$set": {
                "ngo_id": str(ngo["_id"]),
                "ngoName": ngo.get("ngoName", "N/A"),
                "email": ngo.get("email", "N/A"),
                "operationArea": ngo.get("operationArea", "N/A"),
                "focusAreas": ngo.get("focusAreas", []),
                "api_key": api_key,
                "created_at": datetime.utcnow().isoformat()
            }},
            upsert=True
        )

        return jsonify({"message": "API key generated", "api_key": api_key}), 201

    except Exception as e:
        print("Error generating API key:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/apidata", methods=["GET"])
def get_api_data():
    try:
        api_key = request.headers.get("x-api-key")

        if not api_key:
            return jsonify({"error": "API key required"}), 401

        api_record = db.api.find_one({"api_key": api_key})
        if not api_record:
            return jsonify({"error": "Invalid API key"}), 403

        data = list(db.category.find({}))
        formatted = []
        for d in data:
            formatted.append({
                "latitude": float(d.get("latitude", 0)),
                "longitude": float(d.get("longitude", 0)),
                "type": d.get("info", "")
            })

        return jsonify({
            "ngo_id": api_record.get("ngo_id"),
            "ngoName": api_record.get("ngoName"),
            "email": api_record.get("email"),
            "operationArea": api_record.get("operationArea"),
            "focusAreas": api_record.get("focusAreas"),
            "data": formatted
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
