import React from 'react';

function WeatherCard({ weather }) {
  const getWeatherIcon = (description) => {
    if (description.includes("clear")) return "fas fa-sun";
    if (description.includes("cloud")) return "fas fa-cloud";
    if (description.includes("rain")) return "fas fa-cloud-showers-heavy";
    return "fas fa-cloud";
  };

  return (
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
  );
}

export default WeatherCard;
