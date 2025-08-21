import React, { useEffect, useState } from "react";
import "./Home.css";
import foodServing from "./image/food_serving.jpg";
import training from "./image/training.jpg";
import studentStudying from "./image/student_studying.png";
import MapView from "./MapView";


const Home = () => {
  const [stats, setStats] = useState({
    meals: 0,
    students: 0,
    volunteers: 0,
    currentMonth: ''
  });

  // Fetch dashboard stats from Flask
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard_stats");
        const data = await res.json();
        setStats({
          meals: data.meals,
          students: data.students,
          volunteers: data.volunteers,
          currentMonth: data.currentMonth
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="main-nav">
        <div className="container">
          <div className="logo">ARES</div>
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

      {/* Hero Section */}
      <main>
        <section className="hero">
          <h1>Weaving a Stronger Community, Together.</h1>
          <p>
            The ARES platform connects those who can help with those who need it most. 
            Join us to fight poverty, hunger, and education gaps in our communities.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="container">
            <h2>A Tapestry of Support in Four Steps</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="icon">📍</div>
                <h3>Report a Need</h3>
                <p>Citizens and workers use our app to flag real-time needs, from food shortages to school dropouts.</p>
              </div>
              <div className="step-card">
                <div className="icon">🤝</div>
                <h3>Connect & Collaborate</h3>
                <p>Our platform matches volunteers, donors, and NGOs with the communities that need them most.</p>
              </div>
              <div className="step-card">
                <div className="icon">🌱</div>
                <h3>Deliver Support</h3>
                <p>Resources, meals, and educational materials are channeled effectively to verified locations.</p>
              </div>
              <div className="step-card">
                <div className="icon">📊</div>
                <h3>See the Impact</h3>
                <p>Transparent dashboards show how every contribution helps build a better future.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="impact-preview">
          <div className="container">
            <h2>Our Collective Impact, In Real-Time</h2>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{stats.meals}</span>
                <p className="stat-label">Meals Served ({stats.currentMonth})</p>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.students}</span>
                <p className="stat-label">Students Educated</p>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.volunteers}</span>
                <p className="stat-label">Volunteers Connected</p>
              </div>
            </div>
            <a href="/impact" className="btn btn-primary">Explore the Full Impact Dashboard</a>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="get-involved">
          <div className="container">
            <h2>Find Your Thread in the Weave</h2>
            <div className="involvement-grid">
              <div className="involvement-card">
                <div className="icon">👋</div>
                <h3>For Volunteers</h3>
                <p>Your time and skills are most valuable. Find flexible opportunities to serve the society for a noble cause.</p>
                <a href="/reg_vol" className="btn btn-primary">Registration</a>
              </div>
              <div className="involvement-card">
                <div className="icon">🏢</div>
                <h3>For NGOs</h3>
                <p>Amplify your impact. Register your organization to find volunteers, map needs, and receive targeted donations.</p>
                <a href="/reg_ngo" className="btn btn-primary">Register Your NGO</a>
              </div>
              <div className="involvement-card">
                <div className="icon">❤️</div>
                <h3>For Donors</h3>
                <p>Channel your support directly to verified needs and see the transparent results of your generosity.</p>
                <a href="/donation" className="btn btn-primary">Become a Donor</a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Stories Section */}
        <section className="community-stories">
          <div className="container">
            <h2>Stories from Our Community</h2>
            <div className="stories-grid">
              <div className="story-card">
                <img src={foodServing} alt="Community kitchen" />
                <div className="story-card-content">
                  <h3>How a NGO uses ARES to Ensure No One Sleeps Hungry</h3>
                  <a href="#">Read More &rarr;</a>
                </div>
              </div>
              <div className="story-card">
                <img src={training} alt="People learning digital skills" />
                <div className="story-card-content">
                  <h3>Vocational Training Spotlight: Digital Skills for a Brighter Future</h3>
                  <a href="#">Read More &rarr;</a>
                </div>
              </div>
              <div className="story-card">
                <img src={studentStudying} alt="A volunteer teaching a child" />
                <div className="story-card-content">
                  <h3>The Power of One: A Volunteer's Journey in Improving Local Literacy</h3>
                  <a href="#">Read More &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>ARES</h4>
              <p>Connecting communities to create a tapestry of support, fighting poverty, hunger, and education gaps together.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Get Involved</h4>
              <ul>
                <li><a href="/reg_vol">Volunteer</a></li>
                <li><a href="/donation">Donate</a></li>
                <li><a href="/ngo_registration">Partner with Us</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Newsletter</h4>
              <p>Stay updated with our progress and stories.</p>
              <input type="email" placeholder="Enter your email" />
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ARES | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
