from flask import Flask, Response
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
import json

# =====================================================================
# SIMPLE SOLUTION: Clean database connection with minimal logic
# =====================================================================

def convert_objectid(obj):
    """Convert ObjectId to string recursively"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    return obj

def json_response(data):
    """Create JSON response with ObjectId conversion"""
    converted_data = convert_objectid(data)
    return Response(
        json.dumps(converted_data, indent=2),
        mimetype='application/json'
    )

# Flask App
app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["Envix"]

print("Starting Flask server...")
print("Connecting to MongoDB...")

@app.route("/test")
def test():
    return json_response({"message": "Server running", "collections": db.list_collection_names()})

@app.route("/admin/stats")
def admin_stats():
    print("Getting admin stats...")
    
    volunteers_count = db.volunteers.count_documents({})
    ngos_count = db.ngos.count_documents({})
    
    print(f"Found {volunteers_count} volunteers, {ngos_count} NGOs")
    
    return json_response({
        "totalVolunteers": volunteers_count,
        "totalNgos": ngos_count,
        "topInterest": "General",
        "topLocation": "India"
    })

@app.route("/volunteers")
def volunteers():
    print("Getting volunteers...")
    
    try:
        # Get all volunteers
        volunteers_data = list(db.volunteers.find({}))
        print(f"Found {len(volunteers_data)} volunteers")
        
        # Print first volunteer for debugging
        if volunteers_data:
            print(f"Sample volunteer fields: {list(volunteers_data[0].keys())}")
        
        return json_response(volunteers_data)
    except Exception as e:
        print(f"Error getting volunteers: {e}")
        return json_response({"error": str(e)})

@app.route("/ngos")
def ngos():
    print("Getting NGOs...")
    
    try:
        # Get all NGOs
        ngos_data = list(db.ngos.find({}))
        print(f"Found {len(ngos_data)} NGOs")
        
        # Print first NGO for debugging
        if ngos_data:
            print(f"Sample NGO fields: {list(ngos_data[0].keys())}")
        
        return json_response(ngos_data)
    except Exception as e:
        print(f"Error getting NGOs: {e}")
        return json_response({"error": str(e)})

@app.route("/debug")
def debug():
    print("Debug info...")
    
    # Get sample documents
    sample_volunteer = db.volunteers.find_one({})
    sample_ngo = db.ngos.find_one({})
    
    return json_response({
        "collections": db.list_collection_names(),
        "volunteer_count": db.volunteers.count_documents({}),
        "ngo_count": db.ngos.count_documents({}),
        "sample_volunteer": sample_volunteer,
        "sample_ngo": sample_ngo
    })

from flask import request

@app.route("/register/ngo", methods=["POST"])
def register_ngo():
    try:
        data = request.get_json()
        if not data:
            return json_response({"error": "No data provided"}), 400
        
        # Prepare document for MongoDB
        ngo_doc = {
            "name": data.get("ngoName"),
            "registration_id": data.get("regId"),
            "contact_person": data.get("contactPerson"),
            "email": data.get("email"),
            "phone": data.get("contactNumber"),
            "operation_area": data.get("operationArea"),
            "focus_areas": data.get("focusAreas", []),
            "description": data.get("description"),
            "status": "pending_verification",
            "registration_date": datetime.utcnow()
        }

        # Insert into MongoDB
        result = db.ngos.insert_one(ngo_doc)
        print(f"New NGO registered with ID: {result.inserted_id}")

        return json_response({"message": "NGO registration submitted successfully", "id": str(result.inserted_id)})

    except Exception as e:
        print(f"Error registering NGO: {e}")
        return json_response({"error": str(e)}), 500

if __name__ == "__main__":
    print("Server starting on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)