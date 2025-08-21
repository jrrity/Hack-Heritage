import React, { useState } from "react";
import "./VolunteerRegistration.css"; // Make sure this CSS file exists
import vol from "./image/vol.png";

export default function VolunteerRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    interests: [],
    availability: "weekends",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let updatedInterests = [...formData.interests];
      if (checked) {
        updatedInterests.push(value);
      } else {
        updatedInterests = updatedInterests.filter((i) => i !== value);
      }
      setFormData({ ...formData, interests: updatedInterests });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/register_volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          interests: [],
          availability: "weekends",
        });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(data.error || "Failed to register volunteer.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server not reachable.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="main-nav">
        <div className="container">
          <a href="/" className="logo">ARES</a>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/reg_vol">Get Involved</a></li>
              <li><a href="/impact">Our Impact</a></li>
              <li><a href="/survey">Survey</a></li>
              <li><a href="/map">Problem Map</a></li>
            </ul>
          </nav>
          <a href="/donation" className="btn btn-primary">Donate Now</a>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Become a Volunteer</h1>
          <p>
            Join our dedicated team of volunteers and become a thread in the fabric of change.
            Your contribution, big or small, creates a powerful impact in our communities.
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section style={{ paddingTop: 0 }}>
        <div className="container registration-section">
          <div className="form-container">
            <h3>Register Now</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Areas of Interest (Select at least one)</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="interestEdu"
                      name="interests"
                      value="Education"
                      checked={formData.interests.includes("Education")}
                      onChange={handleChange}
                    />
                    <label htmlFor="interestEdu">Education</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="interestHunger"
                      name="interests"
                      value="Food Distribution"
                      checked={formData.interests.includes("Food Distribution")}
                      onChange={handleChange}
                    />
                    <label htmlFor="interestHunger">Food Distribution</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="interestHealth"
                      name="interests"
                      value="Health & Hygiene"
                      checked={formData.interests.includes("Health & Hygiene")}
                      onChange={handleChange}
                    />
                    <label htmlFor="interestHealth">Health & Hygiene</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="weekends">Weekends</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Register as Volunteer
              </button>

              {success && <div className="successMessage">Thank you for registering! We will contact you shortly.</div>}
              {error && <div className="errorMessage">{error}</div>}
            </form>
          </div>

          <img
            src={vol}
            alt="Volunteers doing survey"
            style={{
              width: "75%",
              marginLeft: "150px",
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2025 ARES | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
