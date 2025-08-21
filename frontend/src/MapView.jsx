import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// Helper: calculate centroid
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

// Helper: group nearby points
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

const MapView = ({ fullscreen }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [mapData, setMapData] = useState([]);
  const layersRef = useRef([]); // keep track of added layers

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = L.map(mapContainer.current).setView([22.6, 88.35], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  // Fetch backend data
  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        setMapData(data);
      })
      .catch(err => console.error("Data fetch error:", err));
  }, []);

  // Render markers / clusters
  useEffect(() => {
    if (!map || mapData.length === 0) return;

    const renderMap = () => {
      // Clear old layers
      layersRef.current.forEach(layer => map.removeLayer(layer));
      layersRef.current = [];

      const zoom = map.getZoom();
      if (zoom < 13) return;

      const clusters = groupPoints(mapData, 750);

      clusters.forEach(clusterPoints => {
        if (clusterPoints.length < 3) {
          // Show individual points
          clusterPoints.forEach(p => {
            const marker = L.marker([p.latitude, p.longitude]).addTo(map);
            marker.bindPopup(`<b>Point</b><br>Lat: ${p.latitude}<br>Lng: ${p.longitude}`);
            const circle = L.circle([p.latitude, p.longitude], {
              radius: 200,
              color: "rgba(0,123,255,0.7)",
              fillColor: "rgba(0,123,255,0.3)",
              fillOpacity: 0.3
            }).addTo(map);
            layersRef.current.push(marker, circle);
          });
        } else {
          // Cluster centroid
          const centroid = getCentroid(clusterPoints);
          const color = clusterPoints.length > 7 ? "red" : "orange";

          const clusterIcon = L.divIcon({
            html: `<div style="
              background:${color};
              border-radius:50%;
              width:40px;
              height:40px;
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-weight:bold;
              cursor:pointer;">
              ${clusterPoints.length}
            </div>`,
            className: "",
            iconSize: [40, 40]
          });

          const centroidMarker = L.marker([centroid.lat, centroid.lng], { icon: clusterIcon }).addTo(map);
          const clusterCircle = L.circle([centroid.lat, centroid.lng], {
            radius: 750,
            color: "rgba(255,81,0,0.7)",
            fillColor: "rgba(255,89,0,0.2)",
            fillOpacity: 0.3
          }).addTo(map);

          centroidMarker.bindPopup(`<b>Cluster</b><br>Size: ${centroid.count}<br>Lat: ${centroid.lat}<br>Lng: ${centroid.lng}`);

          layersRef.current.push(centroidMarker, clusterCircle);

          // (Optional) show individual points inside cluster
          clusterPoints.forEach(p => {
            const innerMarker = L.marker([p.latitude, p.longitude]).addTo(map);
            innerMarker.bindPopup(`<b>Point</b><br>Lat: ${p.latitude.toFixed(6)}<br>Lng: ${p.longitude.toFixed(6)}`);
            layersRef.current.push(innerMarker);
          });
        }
      });
    };

    map.on("zoomend", renderMap);
    renderMap();

    return () => map.off("zoomend", renderMap);
  }, [map, mapData]);

  // Handle fullscreen toggle
  useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 300);
    }
  }, [fullscreen, map]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100vh" }} // ✅ force visible height
    />
  );
};

export default MapView;
