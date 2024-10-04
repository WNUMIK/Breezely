import React from 'react';

function ForecastCard({ forecast }) {
  return (
    <div className="row">
      {forecast.map((day, index) => (
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
  );
}

export default ForecastCard;