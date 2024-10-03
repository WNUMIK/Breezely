import React, { useState } from 'react';
import axios from 'axios';
import WeatherCard from './CurrentWeatherCard'; // Import the card for each city's weather
import './css/Weather.css';  // Import your CSS file

function WeatherComparison() {
  const [cityInput, setCityInput] = useState(''); // Input for a single city
  const [cities, setCities] = useState([]); // Array for city names
  const [weatherData, setWeatherData] = useState([]); // Array for weather data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    if (cities.length === 0) {
      setError('Please enter at least one city.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const responses = await Promise.all(
        cities.map(city =>
          axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city } })
        )
      );
      setWeatherData(responses.map(response => response.data));
    } catch (err) {
      setError('One or more cities not found. Please try again.');
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      setCities([...cities, cityInput.trim()]);
      setCityInput(''); // Clear the input after adding
    }
  };

  const handleRemoveCity = (index) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Compare Weather in Multiple Cities</h2>
      <div className="row justify-content-center mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCity()} // Add city on Enter
            />
            <button className="btn btn-secondary" onClick={handleAddCity}>
              Add City
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <button className="btn btn-primary mb-3" onClick={fetchWeatherData}>
          Get Weather
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {error && <p className="text-center text-danger">{error}</p>}

      {cities.length > 0 && (
        <div className="row justify-content-center mb-3">
          <div className="col-md-8">
            <h4 className="text-center">Cities to Compare:</h4>
            <ul className="list-group">
              {cities.map((city, index) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                  {city}
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCity(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {weatherData.length > 0 && (
        <div className="row justify-content-center">
          {weatherData.map((weather, index) => (
            <div className="col-md-4" key={index}>
              <WeatherCard weather={weather} /> {/* Use WeatherCard component */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherComparison;
