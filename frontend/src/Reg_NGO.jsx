import React, { useState } from "react";
import ngo from "./image/ngo.png";

export default function Reg_NGO() {
  const [formData, setFormData] = useState({
    ngoName: "",
    regId: "",
    contactPerson: "",
    email: "",
    contactNumber: "",
    operationArea: "", // will map to "address" in backend
    focusAreas: "",
    description: "",
  });

  const [ngoList, setNgoList] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const focusAreasArr = formData.focusAreas
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    const newNGO = {
      ngoName: formData.ngoName,
      regId: formData.regId,
      contactPerson: formData.contactPerson,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.operationArea, // map to backend field
      focusAreas: focusAreasArr,
      description: formData.description,
    };

    fetch("http://127.0.0.1:5000/register_ngo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNGO),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setNgoList([newNGO, ...ngoList]);
        setFormData({
          ngoName: "",
          regId: "",
          contactPerson: "",
          email: "",
          contactNumber: "",
          operationArea: "",
          focusAreas: "",
          description: "",
        });
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 4000);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div>
      {/* Header */}
      <header className="main-nav" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff", padding: "15px 0", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" className="logo" style={{ fontWeight: 700, fontSize: "1.5rem", color: "#005B5B", textDecoration: "none" }}>ARES</a>
          <nav>
            <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
              <li><a href="/">Home</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/reg_vol">Get Involved</a></li>
              <li><a href="/survey">Survey</a></li>
              <li><a href="/impact">Our Impact</a></li>
            </ul>
          </nav>
          <a href="/donation" className="btn btn-primary" style={{ backgroundColor: "#FF6F61", color: "#fff", padding: "10px 20px", borderRadius: "50px", textDecoration: "none" }}>Donate Now</a>
        </div>
      </header>

      {/* Form & Image */}
      <main>
        <section className="page-header" style={{ paddingTop: "120px", paddingBottom: "60px", textAlign: "center" }}>
          <div className="container">
            <h1 style={{ fontSize: "3rem", color: "#005B5B" }}>Partner with Us</h1>
            <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
              Amplify your impact by joining the ARES network. Register your organization to connect with volunteers, receive targeted donations, and collaborate on building a stronger community.
            </p>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
            <div className="form-container" style={{ flex: "1 1 400px", minWidth: "300px", backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>NGO Registration Form</h3>
              <form onSubmit={handleSubmit}>
                {/* Input fields */}
                {[
                  { label: "Official NGO Name", name: "ngoName", type: "text" },
                  { label: "Registration ID", name: "regId", type: "text" },
                  { label: "Contact Person", name: "contactPerson", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Contact Number", name: "contactNumber", type: "tel" },
                  { label: "Address", name: "operationArea", type: "text" },
                  { label: "Main Focus Areas (comma separated)", name: "focusAreas", type: "text" },
                ].map((field, idx) => (
                  <div className="form-group" style={{ marginBottom: "15px" }} key={idx}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  </div>
                ))}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label>Brief Description of Your Mission</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "120px" }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", backgroundColor: "#FF6F61", color: "#fff", padding: "12px", borderRadius: "50px", border: "none", fontWeight: 700 }}>Submit for Verification</button>
              </form>
              {successMessage && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#5A7D3A", color: "#fff", borderRadius: "5px", textAlign: "center" }}>
                  Thank you! Your application has been submitted for verification.
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
              <img src={ngo} alt="Volunteers working together" style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
            </div>
          </div>
        </section>

        {/* NGO List */}
        {ngoList.length > 0 && (
          <section style={{ padding: "40px 0" }}>
            <div className="container">
              <h3 style={{ textAlign: "center", marginBottom: "30px" }}>Our Partner NGOs</h3>
              <div id="ngoGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                {ngoList.map((ngo, index) => (
                  <div className="ngo-card" key={index} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", borderLeft: "5px solid #5A7D3A" }}>
                    <h4>{ngo.ngoName}</h4>
                    <p><strong>Contact:</strong> {ngo.contactPerson}</p>
                    <p><strong>Phone:</strong> {ngo.contactNumber}</p>
                    <p>📍 {ngo.operationArea}</p>
                    <div className="focus-areas">
                      {ngo.focusAreas.map((area, idx) => (
                        <span key={idx} style={{ display: "inline-block", padding: "4px 10px", borderRadius: "15px", backgroundColor: "#eee", marginRight: "5px", marginBottom: "5px", fontSize: "0.8rem" }}>{area}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#005B5B", color: "#fff", padding: "60px 0 20px 0", textAlign: "center" }}>
        <p>&copy; 2025 ARES | All Rights Reserved</p>
      </footer>
    </div>
  );
}
