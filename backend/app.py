from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017")  # replace if using remote DB
db = client["Envix"]  # your DB name
collection = db["category"]  # your collection name

@app.route("/data")
def get_data():
    data = list(collection.find({}))  # fetch all documents
    formatted = []
    for d in data:
        formatted.append({
            "latitude": float(d.get("latitude", 0)),
            "longitude": float(d.get("longitude", 0)),
            "type": d.get("info", ""),  # optional extra fields
        })
    return jsonify(formatted)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
