import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ ngos: 0, volunteers: 0 });
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [ngoSearch, setNgoSearch] = useState("");

  // Fetch dashboard stats
  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard_stats")
      .then(res => res.json())
      .then(data => setStats({ ngos: data.ngos, volunteers: data.volunteers }))
      .catch(err => console.error(err));
  }, []);

  // Fetch volunteers
  useEffect(() => {
    fetch("http://127.0.0.1:5000/volunteers")
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch NGOs
  useEffect(() => {
    fetch("http://127.0.0.1:5000/ngos")
      .then(res => res.json())
      .then(data => {
        // Only verified NGOs
        setNgos(data.filter(n => n.status === "verified"));
      })
      .catch(err => console.error(err));
  }, []);

  // Utility to find top interest / location
  const findMostCommon = (array, key) => {
    if (!array || array.length === 0) return "--";
    const counts = array.reduce((acc, item) => {
      const values = Array.isArray(item[key]) ? item[key] : (item[key] || "").split(",").map(s => s.trim());
      values.forEach(val => { if (val) acc[val] = (acc[val] || 0) + 1; });
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "--");
  };

  // Filtered data for search
  const filteredVolunteers = volunteers.filter(v =>
    (v.fullName || "").toLowerCase().includes(volunteerSearch.toLowerCase())
  );
  const filteredNgos = ngos.filter(n =>
    (n.ngoName || "").toLowerCase().includes(ngoSearch.toLowerCase())
  );

  return (
    <div>
      <header className="main-nav">
  <div className="container">
    <a href="#" className="logo">ARES Admin Panel</a>
    <nav>
      <a href="/verify" className="nav-link">Verify NGOs</a>
    </nav>
  </div>
</header>

      <main className="container">
        <section className="page-header">
          <h1>Platform Overview</h1>
        </section>

        <section className="metrics-section">
          <div className="dashboard-grid">
            <div className="metric-card">
              <span className="metric-value">{stats.volunteers}</span>
              <p className="metric-label">Total Volunteers</p>
            </div>
            <div className="metric-card">
              <span className="metric-value">{stats.ngos}</span>
              <p className="metric-label">Total Partner NGOs</p>
            </div>
            <div className="metric-card">
              <span className="metric-value">{findMostCommon(volunteers, "interests")}</span>
              <p className="metric-label">Top Volunteer Interest</p>
            </div>
            <div className="metric-card">
              <span className="metric-value">{findMostCommon(ngos, "operationArea")}</span>
              <p className="metric-label">Top NGO Location</p>
            </div>
          </div>
        </section>

        <section className="data-section">
          <div className="data-table-container">
            <h3>Registered Volunteers</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search volunteers..."
              value={volunteerSearch}
              onChange={e => setVolunteerSearch(e.target.value)}
            />
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Interests</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>No data found.</td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((v, idx) => (
                      <tr key={idx}>
                        <td>{v.fullName || "N/A"}</td>
                        <td>{v.city || "N/A"}</td>
                        <td>{Array.isArray(v.interests) ? v.interests.join(", ") : v.interests || "N/A"}</td>
                        <td>{v.availability || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="data-table-container">
            <h3>Partnered NGOs</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search NGOs..."
              value={ngoSearch}
              onChange={e => setNgoSearch(e.target.value)}
            />
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>NGO Name</th>
                    <th>Contact Person</th>
                    <th>Contact Number</th>
                    <th>Location</th>
                    <th>Focus Areas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNgos.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>No data found.</td>
                    </tr>
                  ) : (
                    filteredNgos.map((n, idx) => (
                      <tr key={idx}>
                        <td>{n.ngoName || "N/A"}</td>
                        <td>{n.contactPerson || "N/A"}</td>
                        <td>{n.phone || "N/A"}</td>
                        <td>{n.operationArea || "N/A"}</td>
                        <td>{Array.isArray(n.focusAreas) ? n.focusAreas.join(", ") : n.focusAreas || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}