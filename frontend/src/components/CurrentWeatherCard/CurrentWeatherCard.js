import React from 'react';
import styles from './CurrentWeatherCard.module.css';

function CurrentWeatherCard({ city, temperature, description, humidity, windSpeed }) {
  return (
    <div className={styles.currentWeatherCard}>
      <h2 className={styles.cityName}>{city}</h2>
      <p className={styles.weatherInfo}>Temperature: {temperature}°C</p>
      <p className={styles.weatherInfo}>Description: {description}</p>
      <p className={styles.weatherInfo}>Humidity: {humidity}%</p>
      <p className={styles.weatherInfo}>Wind Speed: {windSpeed} m/s</p>
    </div>
  );
}

export default CurrentWeatherCard;
