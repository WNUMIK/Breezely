import React from 'react';

function WeatherInput({ city, setCity, fetchWeather }) {
  return (
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
  );
}

export default WeatherInput;
