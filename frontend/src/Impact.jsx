import './Impact.css';
import ImpactMap from "./ImpactMap";

import { useState, useEffect } from 'react';

const Impact = () => {
    const [fullscreen, setFullscreen] = useState(false);
    const [stats, setStats] = useState({
        meals: 0,
        students: 0,
        volunteers: 0,
        ngos: 0,
        currentMonth: ''
    });

    const toggleFullscreen = () => setFullscreen(!fullscreen);

    useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/dashboard_stats');
            const data = await res.json();
            console.log("Fetched stats:", data); // <-- check this
            setStats({
                meals: data.meals,
                students: data.students,
                volunteers: data.volunteers,
                ngos: data.ngos,
                currentMonth: data.currentMonth
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        }
    };
    fetchStats();
}, []);


    return (
        <div className="impact-page">
            {/* Navbar */}
            <nav className="main-nav">
                <div className="container">
                    <a href="#" className="logo">ARES</a>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/reg_vol">Get Involved</a></li>
                        <li><a href="/impact">Our Impact</a></li>
                        <li><a href="/survey">Survey</a></li>
                        <li><a href="/map">Problem Map</a></li>
                    </ul>
                    <button className="btn btn-primary">Donate Now</button>
                </div>
            </nav>

            {/* Header */}
            <header className="page-header">
                <h1>Our Impact Dashboard</h1>
                <p>Transparency is a core value. Explore our live data to see how this platform makes a difference.</p>
            </header>

            {/* Stats Section */}
            <section className="dashboard-section container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-number">{stats.meals}</span>
                        <span className="stat-label">Meals Served ({stats.currentMonth})</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.students}</span>
                        <span className="stat-label">Students Educated</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.volunteers}</span>
                        <span className="stat-label">Volunteers Connected</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.ngos}</span>
                        <span className="stat-label">NGOs Partnered</span>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className={`map-section69 container69 ${fullscreen ? 'fullscreen-section' : ''}`}>
                <h2>Impact Map</h2>
                <div className={`map-container69 ${fullscreen ? 'fullscreen' : ''}`}>
                    <ImpactMap fullscreen={fullscreen} />
                    {!fullscreen && (
                        <button className="fullscreen-btn" onClick={toggleFullscreen}>
                            Full Screen
                        </button>
                    )}
                </div>
                {fullscreen && (
                    <button className="btn btn-primary close-fullscreen" onClick={toggleFullscreen}>
                        ✕ Close Map
                    </button>
                )}
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <p>© 2025 ARES | All Rights Reserved</p>
                </div>
            </footer>
        </div>
    );
};

export default Impact;
