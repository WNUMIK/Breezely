import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import sunAnimation from '../../animations/sun.json';
import rainAnimation from '../../animations/rain.json';
import cloudAnimation from '../../animations/cloud.json';
import styles from './FeaturedCities.module.css'; // Import CSS module

const FeaturedCities = ({ onCityClick }) => {
  const [featuredCitiesWeather, setFeaturedCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);
  const popularCities = ['New York', 'Tokyo', 'Paris', 'London', 'Berlin'];

  useEffect(() => {
    const fetchFeaturedCitiesWeather = async () => {
      try {
        const weatherPromises = popularCities.map(city =>
          axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city } }),
        );
        const weatherData = await Promise.all(weatherPromises);
        setFeaturedCitiesWeather(
          weatherData.map((response, index) => ({
            city: popularCities[index],
            ...response.data.current_weather,
          })),
        );
        setLoading(false);
      } catch (err) {
        setError('Error fetching weather data for featured cities');
        setLoading(false);
      }
    };

    fetchFeaturedCitiesWeather();
  }, []);

  const getWeatherAnimation = description => {
    if (description.includes('clear')) {
      return sunAnimation;
    } else if (description.includes('rain')) {
      return rainAnimation;
    } else if (description.includes('cloud')) {
      return cloudAnimation;
    }
  };

  if (loading) {
    return <p>Loading featured cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.featuredCities}>
      {featuredCitiesWeather.map((weather, index) => (
        <div
          className={styles.cityCard}
          key={index}
          onClick={() => onCityClick(weather.city)}
          style={{ cursor: 'pointer' }}
        >
          <h4 className={styles.cityTitle}>{weather.city}</h4>
          <div
            className={styles.animationContainer}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Lottie
              loop
              animationData={getWeatherAnimation(weather.description)}
              play
              speed={hovered ? 1.5 : 1} // Faster speed on hover
              className={styles.lottieWrapper}
            />
          </div>

          <p className={styles.cityTemperature}>
            Temperature: {weather.temperature}°C
          </p>
          <p className={styles.cityDescription}>{weather.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedCities;
