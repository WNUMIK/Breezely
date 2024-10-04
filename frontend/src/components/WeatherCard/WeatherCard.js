import React from 'react';
import styles from './WeatherCard.module.css';

function WeatherCard({ date, temperature, description }) {
  return (
    <div className={styles.weatherCardContainer}>
      <h3 className={styles.weatherCardTitle}>{date}</h3>
      <div className={styles.weatherDetails}>
        <p className={styles.temperature}>{temperature}°C</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default WeatherCard;
