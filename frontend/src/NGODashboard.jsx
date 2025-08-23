import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const NGODashboard = () => {
  const { id } = useParams(); // get ID from URL
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/ngo/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch NGO details");
        return res.json();
      })
      .then((data) => {
        setNgo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching NGO:", err);
        setLoading(false);
      });
  }, [id]);

  const handleGenerateApiKey = async () => {
    setApiLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/generate_api_key/${id}`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) setApiKey(data.api_key);
      else alert(data.error || "Error generating API key");
    } catch (err) {
      alert("Error generating API key. Try again later.");
    }
    setApiLoading(false);
  };

  if (loading) return <p>Loading NGO Dashboard...</p>;
  if (!ngo) return <p>NGO not found!</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome, {ngo.ngoName || ngo.name}</h1>
      <p><b>ID:</b> {ngo._id}</p>
      <p><b>Registration ID:</b> {ngo.registration_id}</p>
      <p><b>Contact Person:</b> {ngo.contactPerson || ngo.contact_person}</p>
      <p><b>Email:</b> {ngo.email}</p>
      <p><b>Phone:</b> {ngo.phone}</p>
      <p><b>Operation Area:</b> {ngo.operationArea || ngo.operation_area}</p>
      <p><b>Status:</b> {ngo.status}</p>
      <p><b>Description:</b> {ngo.description}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGenerateApiKey} disabled={apiLoading}>
          {apiLoading ? "Generating..." : "Generate API Key"}
        </button>
      </div>

      {apiKey && (
        <div style={{ marginTop: "10px" }}>
          <p><b>Your API Key:</b></p>
          <input type="text" value={apiKey} readOnly style={{ width: "100%", padding: "5px" }} />
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/map" style={{ marginRight: "20px" }}>View Map</Link>
        <Link to="/activecases">Active Cases</Link>
      </div>
    </div>
  );
};

export default NGODashboard;
