import React from 'react';

function CurrentWeatherCard({ weather }) {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title text-primary">Current Weather in {weather.city}</h3>
            <p className="display-4">{weather.current_weather.temperature}°C</p>
            <p className="text-muted">Description: {weather.current_weather.description}</p>
            <p>Humidity: {weather.current_weather.humidity}%</p>
            <p>Wind Speed: {weather.current_weather.wind_speed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;
