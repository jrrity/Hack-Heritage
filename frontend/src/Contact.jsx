import React, { useState } from "react";
import "./Contact.css"; // Move your <style> content into Contact.css

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send formData to backend (Flask/Node/etc.)
    setSuccess(true);
    setFormData({ fullName: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
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
      <main>
        <section className="page-header">
          <div className="container">
            <h1>Get In Touch</h1>
            <p>We are here to help. Whether you need assistance, have a question, or want to partner with us, please reach out. Your voice is important to us.</p>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ paddingTop: 0 }}>
          <div className="container contact-section">
            
            {/* Contact Info */}
            <div className="contact-info-container">
              <div className="contact-info-item">
                <div className="icon">📍</div>
                <div>
                  <h4>Our Main Office</h4>
                  <p>Heritage Institute of Technology, Kolkata<br/>West Bengal, 700105, India</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon">⏰</div>
                <div>
                  <h4>Operating Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Weekends: Closed</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon">📧</div>
                <div>
                  <h4>Email Us</h4>
                  <p><a href="mailto:support@ARES.org">support@ARES.org</a></p>
                </div>
              </div>
              <div className="helpline">
                <h4>For Urgent Needs, Call Our 24/7 Helpline</h4>
                <a href="tel:+9118001234567">+91 1800 123 4567</a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h3>Send Us a Message</h3>
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
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Send Message</button>
                {success && (
                  <div id="successMessage">
                    Thank you for contacting us! We have received your message and will respond shortly.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="container1 map-container1">
            <iframe 
              src="https://maps.google.com/maps?q=Heritage%20Institute%20of%20Technology%2C%20Kolkata&output=embed" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ARES Location"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2025 ARES | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Contact;
