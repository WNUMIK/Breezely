import React, { useState } from 'react';
import axios from 'axios';
import './css/Weather.css';  // Import the updated CSS for styling

function WeatherComparison() {
  const [cityInput, setCityInput] = useState(''); // Input for adding a city
  const [cities, setCities] = useState([]); // Array to hold city names
  const [weatherData, setWeatherData] = useState([]); // Array to hold weather data for each city
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch weather data for multiple cities
  const fetchWeatherData = async () => {
    if (cities.length === 0) {
      setError('Please add at least one city.');
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

  // Add a city to the list
  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      setCities([...cities, cityInput.trim()]);
      setCityInput(''); // Clear the input after adding
    }
  };

  // Remove a city from the list
  const handleRemoveCity = (index) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  };

  return (
    <div className="container">
      <h2 className="section-title">Compare Weather in Multiple Cities</h2>

      {/* Input section to add cities */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter city"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>

      {/* Display list of added cities with a remove option */}
      <ul className="city-list">
        {cities.map((city, index) => (
          <li key={index}>
            {city}
            <button onClick={() => handleRemoveCity(index)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Button to fetch weather data for added cities */}
      <button className="get-weather" onClick={fetchWeatherData}>
        Get Weather
      </button>

      {/* Show error message if any */}
      {error && <p className="error">{error}</p>}

      {/* Show loading spinner if fetching data */}
      {loading && <p>Loading...</p>}

      {/* Display weather data for each city in a grid layout */}
      <div className="weather-cards-container">
        {weatherData.map((weather, index) => (
          <div className="weather-card" key={index}>
            <h3>{weather.city}</h3>
            <div className="temperature">{weather.current_weather.temperature}°C</div>
            <div className="description">{weather.current_weather.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherComparison;
