import pandas as pd
from pymongo import MongoClient
from datetime import datetime

# --- Load CSV ---
df = pd.read_csv("data.csv")  # Replace with your CSV filename

# --- MongoDB connection ---
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["Envix"]         # Your database name
collection = db["category"]  # Your collection name

# --- Insert data ---
for _, row in df.iterrows():
    doc = {
        "latitude": float(row["latitude"]),
        "longitude": float(row["longitude"]),
        "area": "Kolkata",  # You can modify if needed
        "info": row["type"].capitalize(),  # e.g., 'Poverty', 'Hunger', 'Education'
        "createdAt": datetime.utcnow()
    }
    collection.insert_one(doc)

print("Data inserted successfully!")
