import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const Verify = () => {
  const [ngos, setNgos] = useState([]);
  const API_URL = "http://127.0.0.1:5000"; // Flask backend

  useEffect(() => {
    fetch(`${API_URL}/ngos/pending`)
      .then((res) => res.json())
      .then((data) => setNgos(data))
      .catch((err) => console.error("Error fetching NGOs:", err));
  }, []);

  const handleVerify = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/ngos/verify/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }), // approved or rejected
      });

      if (res.ok) {
        setNgos((prev) => prev.filter((ngo) => ngo._id !== id));
      }
    } catch (error) {
      console.error("Error updating NGO status:", error);
    }
  };

  return (
    <div className="verify-container">
      {/* Back to Admin link */}
      <h2>
        <a href="/admin" className="back-link">← Back to Admin</a>
      </h2>

      <h2>NGO Verification</h2>
      {ngos.length === 0 ? (
        <p>No NGOs pending verification.</p>
      ) : (
        <table className="verify-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Registration ID</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Operation Area</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ngos.map((ngo) => (
              <tr key={ngo._id}>
                <td>{ngo.name}</td>
                <td>{ngo.registration_id}</td>
                <td>{ngo.contact_person}</td>
                <td>{ngo.email}</td>
                <td>{ngo.phone}</td>
                <td>{ngo.operation_area}</td>
                <td>{ngo.status || "pending_verification"}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleVerify(ngo._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleVerify(ngo._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Verify;
