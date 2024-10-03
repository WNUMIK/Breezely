import React, { useState } from 'react';
import axios from 'axios';
import WeatherInput from './WeatherInput';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastCard from './ForecastCard';
import WeatherChart from './WeatherChart';

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

  return (
    <div className="container">
      <h1 className="text-center my-4">Breezely - Weather App</h1>

      <WeatherInput city={city} setCity={setCity} fetchWeather={fetchWeather} />

      {loading && <div className="text-center">Loading...</div>}

      {weather && (
        <>
          <CurrentWeatherCard weather={weather} />
          <h3 className="text-center my-4">5-Day Temperature Trend</h3>
          <WeatherChart weather={weather} />
          <ForecastCard forecast={weather.forecast} />
        </>
      )}

      {error && <p className="text-center text-danger">{error}</p>}
    </div>
  );
}

export default Weather;
