import React, { useEffect, useState } from 'react';
import CurrentWeatherCard from '../CurrentWeatherCard/CurrentWeatherCard';
import styles from './WeatherComparison.module.css';
import axios from 'axios';

function WeatherComparison({ citiesWeather, setCitiesWeather, onBack }) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCitiesWeather = JSON.parse(localStorage.getItem('citiesWeather'));
    if (savedCitiesWeather) {
      setCitiesWeather(savedCitiesWeather);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('citiesWeather', JSON.stringify(citiesWeather));
  }, [citiesWeather]);

  const handleAddCity = async () => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await axios.get('http://127.0.0.1:5000/api/weather', {
        params: { city: city.trim() },
      });

      if (citiesWeather.some((cw) => cw.city === response.data.city)) {
        setError('City is already in the comparison.');
        setLoading(false);
        return;
      }

      setCitiesWeather((prevCitiesWeather) => [...prevCitiesWeather, response.data]);
      setCity('');
    } catch (err) {
      setError('Failed to fetch weather data for the city.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCity = (cityToRemove) => {
    setCitiesWeather((prevCitiesWeather) =>
      prevCitiesWeather.filter((cw) => cw.city !== cityToRemove)
    );
  };

  const getSummary = () => {
    if (citiesWeather.length < 2) return null;

    const highestTempCity = citiesWeather.reduce((prev, curr) =>
      curr.current_weather.temperature > prev.current_weather.temperature ? curr : prev
    );

    return (
      <div className={styles.comparisonSummary}>
        <p>
          <strong>{highestTempCity.city}</strong> has the highest temperature: {highestTempCity.current_weather.temperature}°C
        </p>
      </div>
    );
  };

  return (
    <div className={styles.weatherComparisonContainer}>
      <h3 className={styles.weatherComparisonTitle}>Weather Comparison</h3>
      <div className={styles.addCitySection}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Add city for comparison"
        />
        <button onClick={handleAddCity}>Add City</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      {loading && (
        <div className={styles.loadingSpinner}>
          <p>Loading city weather...</p>
        </div>
      )}
      {citiesWeather.length > 0 ? (
        <>
          {getSummary()}
          <div className={styles.comparisonGrid}>
            {citiesWeather.map((cityWeather, index) => (
              <div key={index} className={styles.comparisonCard}>
                <CurrentWeatherCard
                  city={cityWeather.city}
                  temperature={cityWeather.current_weather.temperature}
                  description={cityWeather.current_weather.description}
                  humidity={cityWeather.current_weather.humidity}
                  windSpeed={cityWeather.current_weather.wind_speed}
                />
                <button className={styles.removeButton} onClick={() => handleRemoveCity(cityWeather.city)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No cities selected for comparison.</p>
      )}
      <div className={styles.clearBackButtons}>
        <button onClick={() => setCitiesWeather([])} className={styles.clearButton}>
          Clear All
        </button>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
      </div>
    </div>
  );
}

export default WeatherComparison;
