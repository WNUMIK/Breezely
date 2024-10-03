import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherChart from './WeatherChart';
import ForecastCard from './ForecastCard';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';
import './css/Weather.css';

function SingleCityWeather({ city, onBack }) {
    const [currentCity, setCurrentCity] = useState(city);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (currentCity) {
                setLoading(true);
                setError(''); // Clear the error before making the request

                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city: currentCity } });
                    setWeatherData(response.data.current_weather);
                    setForecastData(response.data.forecast);
                    setError(''); // Clear error if data is successfully fetched
                } catch (err) {
                    setError('City not found. Please try again.'); // Set error if fetch fails
                    setWeatherData(null);
                    setForecastData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWeatherData();
    }, [currentCity]);

    const getWeatherAnimation = (description) => {
        if (description.includes('clear')) {
            return sunAnimation;
        } else if (description.includes('rain')) {
            return rainAnimation;
        } else if (description.includes('cloud')) {
            return cloudAnimation;
        }
    };

    const handleSearch = () => {
        if (currentCity.trim()) {
            setCurrentCity(currentCity); // Update the city state
        }
    };

    return (
        <div>
            <button className="back-button" onClick={onBack} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                Back
            </button>

            <h2 className="section-title">Weather for {currentCity}</h2>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)} // Update local state with input
                />
                <button onClick={handleSearch}>Search</button> {/* Button to search for a new city */}
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>} {/* Display error if exists */}

            {weatherData && (
                <div className="weather-card">
                    <div className="weather-details">
                        <h3>Current Weather in {currentCity}</h3>
                        <p>{weatherData.temperature}°C</p>
                        <p>{weatherData.description}</p>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                    </div>
                    <div className="weather-animation">
                        <Lottie
                            loop
                            animationData={getWeatherAnimation(weatherData.description)}
                            play
                            style={{ width: '150px', height: '150px' }} // Adjust size as needed
                        />
                    </div>
                </div>
            )}

            {forecastData && (
                <>
                    <WeatherChart weather={{ forecast: forecastData }} />
                    <ForecastCard forecast={forecastData} />
                </>
            )}
        </div>
    );
}

export default SingleCityWeather;
