import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// Calculate centroid of points
const getCentroid = (points) => {
  let latSum = 0, lngSum = 0;
  points.forEach(p => {
    latSum += p.latitude;
    lngSum += p.longitude;
  });
  return {
    lat: latSum / points.length,
    lng: lngSum / points.length,
    count: points.length
  };
};

// Group points by distance
const groupPoints = (points, radiusMeters) => {
  const clusters = [];
  const used = new Set();

  points.forEach((point, idx) => {
    if (used.has(idx)) return;
    const clusterPoints = [point];
    used.add(idx);

    points.forEach((other, jdx) => {
      if (used.has(jdx)) return;
      const dist = L.latLng(point.latitude, point.longitude)
        .distanceTo(L.latLng(other.latitude, other.longitude));
      if (dist <= radiusMeters) {
        clusterPoints.push(other);
        used.add(jdx);
      }
    });

    clusters.push(clusterPoints);
  });

  return clusters;
};

const MapView = () => {
  const [mapData, setMapData] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("map").setView([22.6, 88.35], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© Envix",
      maxZoom: 19,
    }).addTo(mapInstance);
    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => setMapData(data))
      .catch(err => console.error("Data fetch error:", err));
  }, []);

  useEffect(() => {
    if (!map || mapData.length === 0) return;

    let layers = [];

    const renderMap = () => {
      layers.forEach(layer => map.removeLayer(layer));
      layers = [];

      const zoom = map.getZoom();
      if (zoom < 13) return;

      const clusters = groupPoints(mapData, 750);

      clusters.forEach(clusterPoints => {
        if (clusterPoints.length < 3) {
          // Show individual points normally
          clusterPoints.forEach(p => {
            const marker = L.marker([p.latitude, p.longitude]).addTo(map);
            marker.bindPopup(`
              <div>
                <b>Point</b><br>
                <b>Latitude:</b> ${p.latitude}<br>
                <b>Longitude:</b> ${p.longitude}
              </div>
            `);
            const circle = L.circle([p.latitude, p.longitude], {
              radius: 200,
              color: "rgba(0,123,255,0.7)",
              fillColor: "rgba(0,123,255,0.3)",
              fillOpacity: 0.3
            }).addTo(map);
            layers.push(marker, circle);
          });
        }
        else {
          // Show cluster marker
          const centroid = getCentroid(clusterPoints);
          let color = clusterPoints.length > 7 ? "red" : "orange";

          const clusterIcon = L.divIcon({
            html: `<div style="
              pointer-events: auto;
              background:${color};
              border-radius:50%;
              width:40px;
              height:40px;
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-weight:bold;
              cursor: pointer;">
              ${clusterPoints.length}
            </div>`,
            className: "",
            iconSize: [40, 40]
          });

          const centroidMarker = L.marker([centroid.lat, centroid.lng], { icon: clusterIcon }).addTo(map);
          const clusterCircle = L.circle([centroid.lat, centroid.lng], {
            radius: 750,
            color: "rgba(255, 81, 0, 0.7)",
            fillColor: "rgba(255, 89, 0, 0.2)",
            fillOpacity: 0.3
          }).addTo(map);

          layers.push(centroidMarker, clusterCircle);

          // Bind popup and ensure it opens on click
          centroidMarker.bindPopup(`
            <div style="min-width: 150px;">
              <b>Centroid Point</b><br>
              <b>Cluster Size:</b> ${centroid.count}<br>
              <b>Latitude:</b> ${centroid.lat}<br>
              <b>Longitude:</b> ${centroid.lng}<br>
              <b>Zoom Level:</b> ${zoom}
            </div>
          `);

          // Show points inside cluster as smaller markers with popups
          clusterPoints.forEach(p => {
            const innerMarker = L.marker([p.latitude, p.longitude]).addTo(map);
            innerMarker.bindPopup(`
              <div>
                <b>Point</b><br>
                <b>Latitude:</b> ${p.latitude.toFixed(6)}<br>
                <b>Longitude:</b> ${p.longitude.toFixed(6)}
              </div>
            `);
            const innerCircle = L.circle([p.latitude, p.longitude], {
              radius: 200,
              color: "rgba(0,123,255,0.7)",
              fillColor: "rgba(0,123,255,0.3)",
              fillOpacity: 0.3
            }).addTo(map);
            layers.push(innerMarker, innerCircle);
          });
        }
      });
    };
    map.on("zoomend", renderMap);
    renderMap();
    return () => {
      map.off("zoomend", renderMap);
      layers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, mapData]);

  return (
    <>
  <div style={{ height: "100vh", width: "100vw", position: "fixed" ,}}>
    <nav style={{
      position: "relative",
      top: 0,
      left: 60,
      width: "3%",
      color: "white",
      padding: "10px 20px",
      display: "flex",
      gap: "30px",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <Link to="/" style={{ color: "white" }}>
        <button>
          ←
        </button>
        </Link>
    </nav>
    <div id="map" style={{ height: "100%", width: "100%" }} />
  </div>
</>

  );
};

export default MapView;
