import React from "react";
import { Link } from "react-router-dom";

export default function Report() {
  return <div style={{ padding: "20px" }}>
      <nav style={{ marginTop: "10px", display: "flex", gap: "40px" ,fontSize:"20px"}}>
        <Link to="/" style={{ color: "black" }}>Home</Link>
        <Link to="/map" style={{ color: "black" }}>Map View</Link>
        <Link to="/report" style={{ color: "black" }}>Report</Link>
        <Link to="/active" style={{ color: "black" }}>Active Cases</Link>
        <Link to="/resolved" style={{ color: "black" }}>Resolved Cases</Link>
      </nav>
      <h1>Welcome to the Report</h1>
      
    </div>
}
