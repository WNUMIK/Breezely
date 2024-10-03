import React, { useState } from 'react';
import axios from 'axios';


function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {
        params: { city }
      });

      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found');
      setWeather(null);
    }
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
            />
            <button className="btn btn-primary" onClick={fetchWeather}>
              Get Weather
            </button>
          </div>
        </div>
      </div>

      {weather && (
        <div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">Current Weather in {weather.city}</h3>
                  <p className="card-text">Temperature: {weather.current_weather.temperature}°C</p>
                  <p className="card-text">Description: {weather.current_weather.description}</p>
                  <p className="card-text">Humidity: {weather.current_weather.humidity}%</p>
                  <p className="card-text">Wind Speed: {weather.current_weather.wind_speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {weather.forecast.map((day, index) => (
              <div className="col-md-4" key={index}>
                <div className="card mb-4">
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
