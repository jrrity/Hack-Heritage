import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import markercluster
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const MapView = () => {
  const [mapData, setMapData] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log("Initializing map with data support...");
    
    // Create map
    const mapInstance = L.map('map').setView([22.6, 88.35], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance);
    
    console.log("Map created successfully");
    setMap(mapInstance);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up map...");
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Fetching data...");
    
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setMapData(data);
      })
      .catch(err => {
        console.error("Data fetch error:", err);
        // Use test data if API fails
        setMapData([
          {latitude: 22.5, longitude: 88.3, type: "Test Point 1"},
          {latitude: 22.6, longitude: 88.4, type: "Test Point 2"},
          {latitude: 22.55, longitude: 88.35, type: "Test Point 3"},
          {latitude: 22.65, longitude: 88.38, type: "Test Point 4"},
          {latitude: 22.52, longitude: 88.32, type: "Test Point 5"},
        ]);
      });
  }, []);

  useEffect(() => {
    if (map && mapData.length > 0) {
      console.log("Adding simple markers for", mapData.length, "points");

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.MarkerClusterGroup) {
          map.removeLayer(layer);
        }
      });

      // Add individual markers directly to map (no clustering)
      mapData.forEach((point, index) => {
        if (point.latitude && point.longitude) {
          const marker = L.marker([point.latitude, point.longitude]);
          marker.bindPopup(`
            <div style="min-width: 150px;">
              <b>Type:</b> ${point.type || 'Unknown'}<br>
              <b>Latitude:</b> ${point.latitude}<br>
              <b>Longitude:</b> ${point.longitude}
            </div>
          `);
          marker.addTo(map);
        } else {
          console.warn("Invalid coordinates for point", index, point);
        }
      });

      console.log("Simple markers added successfully");
    }
  }, [map, mapData]);

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      height: "100vh", 
      width: "100vw",
      zIndex: 1
    }}>
      <div 
        id="map" 
        style={{ 
          height: "100%",
          width: "100%"
        }}
      />
      
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div><strong>📊 Map Status</strong></div>
        <div>🎯 Data Points: {mapData.length}</div>
        <div>🗺️ Map: {map ? '✅ Ready' : '⏳ Loading'}</div>
      </div>

      {/* Loading indicator */}
      {mapData.length === 0 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          padding: '10px 20px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontSize: '14px'
        }}>
          📡 Loading data...
        </div>
      )}
    </div>
  );
};

export default MapView;