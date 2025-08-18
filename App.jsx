import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import MapView from "./MapView";
import Report from "./Report";
import ActiveCases from "./ActiveCases";
import ResolvedCases from "./ResolvedCases";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/report" element={<Report />} />
        <Route path="/active" element={<ActiveCases />} />
        <Route path="/resolved" element={<ResolvedCases />} />
      </Routes>
    </Router>
  );
}

export default App;
