import React from 'react';

const CurrentWeatherCard = ({ weather }) => {
  // Safeguard: check if weather data exists
  if (!weather || !weather.temperature) {
    return <p>Weather data is not available.</p>;
  }

  return (
    <div className="row justify-content-center">
      <h3 className="card-title text-primary">Current Weather in {weather.city}</h3>
      <p className="display-4">{weather.temperature}°C</p>
      <p className="text-muted">{weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.wind_speed} m/s</p>
    </div>
  );
};

export default CurrentWeatherCard;
