import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const ImpactMap = ({ fullscreen }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [mapData, setMapData] = useState([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = L.map(mapContainer.current).setView([22.6, 88.35], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© Envix",
      maxZoom: 19,
    }).addTo(mapInstance);
    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  // Fetch points
  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => setMapData(data))
      .catch(err => console.error("Data fetch error:", err));
  }, []);

  // Render points
  useEffect(() => {
    if (!map || mapData.length === 0) return;

    const layers = [];

    const renderPoints = () => {
      // Clear old layers
      layers.forEach(layer => map.removeLayer(layer));
      layers.length = 0;

      if (map.getZoom() < 13) return; // Only show points above zoom 13

      mapData.forEach(p => {
        const marker = L.marker([p.latitude, p.longitude]).addTo(map);

        const type = p.type || "Location";
        marker.bindPopup(
          `<b>${type}</b><br>Latitude: ${p.latitude.toFixed(6)}<br>Longitude: ${p.longitude.toFixed(6)}`
        );

        const circle = L.circle([p.latitude, p.longitude], {
          radius: 200,
          color: "rgba(0,123,255,0.7)",
          fillColor: "rgba(0,123,255,0.3)",
          fillOpacity: 0.3,
        }).addTo(map);

        layers.push(marker, circle);
      });
    };

    renderPoints();
    map.on("zoomend", renderPoints);

    return () => {
      map.off("zoomend", renderPoints);
      layers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, mapData]);

  // Handle fullscreen toggle
  useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 300);
    }
  }, [fullscreen, map]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default ImpactMap;
