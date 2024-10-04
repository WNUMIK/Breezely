import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import sunAnimation from '../animations/sun.json';
import rainAnimation from '../animations/rain.json';
import cloudAnimation from '../animations/cloud.json';
import styles from './FavoriteCities.module.css';

function FavoriteCities() {
  const [favoriteCities, setFavoriteCities] = useState(
    JSON.parse(localStorage.getItem('favoriteCities')) || []
  );
  const [favoriteCitiesWeather, setFavoriteCitiesWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCitiesWeather = async () => {
      try {
        const weatherPromises = favoriteCities.map((city) =>
          axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city } })
        );
        const weatherData = await Promise.all(weatherPromises);
        const weatherMap = weatherData.reduce((acc, response, index) => {
          acc[favoriteCities[index]] = response.data.current_weather;
          return acc;
        }, {});
        setFavoriteCitiesWeather(weatherMap);
        setLoading(false);
      } catch (err) {
        setError('Error fetching weather data for favorite cities');
        setLoading(false);
      }
    };

    if (favoriteCities.length > 0) {
      fetchFavoriteCitiesWeather();
    } else {
      setLoading(false);
    }
  }, [favoriteCities]);

  const removeCity = (city) => {
    const updatedFavorites = favoriteCities.filter(favCity => favCity !== city);
    setFavoriteCities(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
  };

  const getWeatherAnimation = (description) => {
    if (description.includes('clear')) {
      return sunAnimation;
    } else if (description.includes('rain')) {
      return rainAnimation;
    } else if (description.includes('cloud')) {
      return cloudAnimation;
    }
  };

  if (loading) {
    return <p>Loading favorite cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.favoriteCitiesContainer}>
      <h3>Your Favorite Cities</h3>
      {favoriteCities.length === 0 ? (
        <p>No favorite cities added yet.</p>
      ) : (
        favoriteCities.map((city, index) => (
          <div key={index} className={styles.favoriteCityCard}>
            <button onClick={() => removeCity(city)} className={styles.removeButton}>×</button>
            <div className={styles.weatherDetails}>
              <h3>{city}</h3>
              {favoriteCitiesWeather[city] ? (
                <>
                  <Lottie
                    loop
                    animationData={getWeatherAnimation(favoriteCitiesWeather[city].description)}
                    play
                    style={{ width: 80, height: 80, margin: '0 auto' }}
                  />
                  <p className={styles.cityTemperature}>Temperature: {favoriteCitiesWeather[city].temperature}°C</p>
                  <p className={styles.cityDescription}>{favoriteCitiesWeather[city].description}</p>
                </>
              ) : (
                <p>Loading weather...</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FavoriteCities;
