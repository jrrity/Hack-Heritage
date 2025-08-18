import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  useEffect(() => {
    fetch("http://127.0.0.1:5000/school_tracker")
      .then(res => res.json())
      .then(data => setTracker(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/impact_dashboard")
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/learning_hub")
      .then(res => res.json())
      .then(data => setLearning(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ 
      padding: "20px", 
      background: "#fefefeff", 
      color: "black",
      minHeight: "100%",   // allow the div to grow
    }}>
      {/* Navbar */}
      <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <Link to="/" style={{ color: "black", textDecoration: "none" }}>Home</Link>
        <Link to="/map" style={{ color: "black", textDecoration: "none" }}>Map View</Link>
        <Link to="/report" style={{ color: "black", textDecoration: "none" }}>Report</Link>
        <Link to="/active" style={{ color: "black", textDecoration: "none" }}>Active Cases</Link>
        <Link to="/resolved" style={{ color: "black", textDecoration: "none" }}>Resolved Cases</Link>
      </nav>

      <h1>Welcome to the Dashboard</h1>

      
    </div>
  );
}
