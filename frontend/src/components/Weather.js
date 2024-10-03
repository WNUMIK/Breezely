import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/Weather.css';  // Import your CSS file


function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (city === '') {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {
        params: { city },
      });

      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description) => {
    if (description.includes("clear")) return "fas fa-sun";
    if (description.includes("cloud")) return "fas fa-cloud";
    if (description.includes("rain")) return "fas fa-cloud-showers-heavy";
    return "fas fa-cloud";
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Breezely - Weather App</h1>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" onClick={fetchWeather}>
              Get Weather
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {weather && (
        <div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title text-primary">Current Weather in {weather.city}</h3>
                  <p className="display-4">{weather.current_weather.temperature}°C</p>
                  <i className={getWeatherIcon(weather.current_weather.description)}></i>
                  <p className="text-muted">Description: {weather.current_weather.description}</p>
                  <p>Humidity: {weather.current_weather.humidity}%</p>
                  <p>Wind Speed: {weather.current_weather.wind_speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-center my-4">5-Day Temperature Trend</h3>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Line
                data={{
                  labels: weather.forecast.map((day) =>
                    new Date(day.date).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: 'Temperature (°C)',
                      data: weather.forecast.map((day) => day.temperature),
                      fill: false,
                      borderColor: 'rgba(75,192,192,1)',
                      tension: 0.1,
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="forecast-container">
            {weather.forecast.map((day, index) => (
              <div className="forecast-card" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{new Date(day.date).toDateString()}</h5>
                    <p className="card-text">Temperature: {day.temperature.toFixed(1)}°C</p>
                    <p className="card-text">Description: {day.description}</p>
                    <p className="card-text">Humidity: {day.humidity.toFixed(1)}%</p>
                    <p className="card-text">Wind Speed: {day.wind_speed.toFixed(1)} m/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-center text-danger">{error}</p>}
    </div>
  );
}

export default Weather;
