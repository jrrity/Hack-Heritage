# backend/app.py
from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return "Flask server is running!"
@app.route("/data")
def get_data():
    df = pd.read_excel("data.xlsx")  # columns: latitude, longitude, type
    data = df.to_dict(orient="records")
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
