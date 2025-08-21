import React, { useState } from "react";

export default function Survey() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState(""); // single selected problem type

  const problemOptions = ["Poverty", "Hunger", "Education", "Healthcare", "Sanitation"];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);

          // Reverse geocode to get city/locality using OpenStreetMap Nominatim
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const address = data.address || {};
            const areaName = address.suburb || address.neighbourhood || address.city || address.town || address.village || "";
            setArea(areaName);
          } catch (err) {
            console.error("Error fetching location name:", err);
          }
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!area || !latitude || !longitude || !type) {
      alert("Please fill all fields and select a problem type");
      return;
    }

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lonNum)) {
      alert("Latitude and Longitude must be valid numbers");
      return;
    }

    const payload = { latitude: latNum, longitude: lonNum, area, type };

    try {
      const response = await fetch("http://127.0.0.1:5000/submit_problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setLatitude("");
        setLongitude("");
        setArea("");
        setType("");
      } else {
        alert(result.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting problem. Check console for details.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="main-nav" style={{ backgroundColor: "#FFFFFF", padding: "15px 0", position: "fixed", top: 0, width: "100%", zIndex: 1000, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <a href="/" className="logo" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#005B5B", textDecoration: "none" }}>ARES</a>
          <nav>
            <ul style={{ listStyle: "none", display: "flex", margin: 0, padding: 0 }}>
              <li style={{ margin: "0 20px" }}><a href="/" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Home</a></li>
              <li style={{ margin: "0 20px" }}><a href="/contact" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Contact</a></li>
              <li style={{ margin: "0 20px" }}><a href="/reg_vol" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Get Involved</a></li>
              <li style={{ margin: "0 20px" }}><a href="/impact" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Our Impact</a></li>
              <li style={{ margin: "0 20px" }}><a href="/survey" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Survey</a></li>
              <li style={{ margin: "0 20px" }}><a href="/map" style={{ textDecoration: "none", color: "#333", fontWeight: 700 }}>Problem Map</a></li>
            </ul>
          </nav>
          <a href="/donation" className="btn btn-primary" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: 700, backgroundColor: "#FF6F61", color: "#FFFFFF", transition: "all 0.3s ease" }}>Donate Now</a>
        </div>
      </header>

      {/* Survey Form */}
      <div style={{ paddingTop: "120px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Report a Problem</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div>
            <label>Area / Locality:</label>
            <input 
              type="text" 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              placeholder="Enter area or locality"
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label>Latitude:</label>
            <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Enter latitude" style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>

          <div>
            <label>Longitude:</label>
            <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Enter longitude" style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>

          <button type="button" onClick={handleGetLocation} style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#005B5B", color: "#fff", border: "none", cursor: "pointer" }}>Use My Location</button>

          <div>
            <label>Problem Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
              <option value="">Select a problem type</option>
              {problemOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ padding: "12px", borderRadius: "5px", backgroundColor: "#FF6F61", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>Submit Problem</button>
        </form>
      </div>
    </div>
  );
}