import React from 'react';
import styles from './ForecastCard.module.css';

function ForecastCard({ forecast }) {
  return (
    <div className={styles.cardContainer}>
      {forecast.map((day, index) => (
        <div key={index} className={styles.forecastCard}>
          <h4>{day.date}</h4>
          <p>Temperature: {day.temperature}°C</p>
          <p>Description: {day.description}</p>
          <p>Humidity: {day.humidity}%</p>
          <p>Wind Speed: {day.wind_speed} m/s</p>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
