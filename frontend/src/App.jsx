import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import MapView from "./MapView";
import Impact from "./Impact";
import Contact from "./Contact";
import VolunteerRegistration from './VolunteerRegistration';
import AdminDashboard from './AdminDashboard';
import ImpactMap from "./ImpactMap";
import Reg_NGO from "./Reg_NGO";
import Survey from "./Survey";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView fullscreen={true} />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reg_vol" element={<VolunteerRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/imp" element={<ImpactMap />} />
        <Route path="/reg_ngo" element={<Reg_NGO />} />
        <Route path="/survey" element={<Survey />} />

      </Routes>
    </Router>
  );
}
export default App;