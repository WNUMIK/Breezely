import React, { useState } from 'react';
import axios from 'axios';
import WeatherCard from './CurrentWeatherCard';
import WeatherChart from './WeatherChart';
import ForecastCard from './ForecastCard';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';
import './css/Weather.css';

function SingleCityWeather({ onBack }) {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    if (city.trim() === '') {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city } });
      setWeatherData(response.data.current_weather);
      setForecastData(response.data.forecast);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherAnimation = (description) => {
    if (description.includes('clear')) {
      return sunAnimation;
    } else if (description.includes('rain')) {
      return rainAnimation;
    } else if (description.includes('cloud')) {
      return cloudAnimation;
    }
  };

  return (
    <div>
      <h2 className="section-title">Weather for a Single City</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherData}>Get Weather</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <div className="weather-details">
            <h3>Current Weather in {city}</h3>
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

      <button className="back-button" onClick={onBack}>Back</button>
    </div>
  );
}

export default SingleCityWeather;
