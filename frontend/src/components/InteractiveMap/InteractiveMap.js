import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import styles from './InteractiveMap.module.css'; // Optional CSS for the map

const MapClickHandler = ({ setPosition, setWeatherData, setLoading, setError, setOpenPopup }) => {
    useMapEvents({
        click: async (event) => {
            const { lat, lng } = event.latlng;

            console.log("Map clicked at:", lat, lng);

            setPosition({ lat, lon: lng });
            setLoading(true);
            setOpenPopup(false); // Reset the popup state to prevent opening prematurely

            try {
                const response = await axios.get(
                    `http://127.0.0.1:5000/api/weather?lat=${lat}&lon=${lng}`
                );

                setWeatherData({
                    city: response.data.city,
                    temperature: response.data.current_weather.temperature,
                    description: response.data.current_weather.description,
                    lat,
                    lon: lng,
                });

                setError(null); // Clear any previous errors
                setOpenPopup(true); // Only open popup after the data is ready
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setError('Failed to fetch weather data. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });
    return null;
};

const InteractiveMap = () => {
    const [position, setPosition] = useState(null);  // Position for the marker
    const [weatherData, setWeatherData] = useState(null);  // Weather data state
    const [loading, setLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const [openPopup, setOpenPopup] = useState(false); // Popup open state

    const markerRef = useRef(null); // Create a ref for the marker

    // Use useEffect to open the popup only after weather data is fetched
    useEffect(() => {
        if (openPopup && markerRef.current && weatherData) {
            markerRef.current.openPopup();
        }
    }, [openPopup, weatherData]);  // Ensure the popup opens only after data is ready

    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={3} className={styles.map}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler
                    setPosition={setPosition}
                    setWeatherData={setWeatherData}
                    setLoading={setLoading}
                    setError={setError}
                    setOpenPopup={setOpenPopup} // Pass the popup state setter
                />

                {/* Display marker and popup if data exists */}
                {position && weatherData && (
                    <Marker position={[position.lat, position.lon]} ref={markerRef}>
                        <Popup
                            autoPan={true}
                            closeOnClick={false}
                            autoClose={false}
                            position={[position.lat, position.lon]}
                        >
                            <div>
                                <h3>{weatherData.city}</h3>
                                <p>Temperature: {weatherData.temperature}°C</p>
                                <p>{weatherData.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Show loading spinner */}
            {loading && <p>Loading weather data...</p>}

            {/* Show error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default InteractiveMap;
