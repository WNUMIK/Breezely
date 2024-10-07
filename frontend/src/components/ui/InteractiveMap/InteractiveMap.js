import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useMapClickWeather from '../../../hooks/useMapClickWeather'; // Custom hook for map click and weather fetching
import styles from './InteractiveMap.module.css';

// Child component that handles click events and updates markers
const MapClickHandler = ({ setMarker }) => {
  const { loading, error } = useMapClickWeather(setMarker); // Call the custom hook for map click handling

  return (
    <>
      {loading && <div className={styles.loading}>Loading weather data...</div>}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

const InteractiveMap = ({ showHeatmap }) => {
  const mapRef = useRef(null); // Reference for the map instance
  const markerRef = useRef(null); // Reference for the marker
  const popupRef = useRef(null); // Reference for the popup
  const heatmapLayerRef = useRef(null); // Reference for heatmap layer
  const [marker, setMarker] = useState(null); // Store a single marker with weather data

  const heatmapData = [
    [51.505, -0.09, 0.5],
    [51.51, -0.1, 0.7],
    [51.52, -0.12, 0.9],
  ];

  // Effect to manage heatmap layer based on the `showHeatmap` prop
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      if (showHeatmap && !heatmapLayerRef.current) {
        heatmapLayerRef.current = L.heatLayer(heatmapData, {
          radius: 25,
          blur: 15,
        }).addTo(map);
      } else if (!showHeatmap && heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
        heatmapLayerRef.current = null;
      }
    }
  }, [showHeatmap]);

  // Effect to open the popup automatically after the marker is set
  useEffect(() => {
    if (markerRef.current && popupRef.current) {
      markerRef.current.openPopup(); // Manually open the popup
    }
  }, [marker]); // Run this effect every time the marker is updated

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={5}
      className={styles.map}
      whenCreated={map => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Call the click handler component */}
      <MapClickHandler setMarker={setMarker} />

      {/* Render a single marker with weather data in the popup */}
      {marker && (
        <Marker
          position={[marker.lat, marker.lon]}
          ref={markerRef} // Reference to the marker
        >
          <Popup ref={popupRef}>
            <div>
              <h3>{marker.cityName}</h3>
              <p>🌡️ Temperature: {marker.temperature}°C</p>
              <p>🌧️ {marker.description}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;
