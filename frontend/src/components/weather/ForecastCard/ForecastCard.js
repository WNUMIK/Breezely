import React from 'react';
import styles from './ForecastCard.module.css';

function ForecastCard({ forecast }) {
  return (
    <div className={styles.forecastSection}>
      {forecast.map((day, index) => (
        <div key={index} className={styles.forecastCard}>
          <h4>{new Date(day.date).toLocaleDateString()}</h4>
          <div className={styles.infoRow}>
            <p><span className={styles.icon}>🌡️</span> <strong>{day.temperature}°C</strong></p>
            <p><span className={styles.icon}>💧</span> Humidity: <strong>{day.humidity}%</strong></p>
          </div>
          <div className={styles.infoRow}>
            <p><span className={styles.icon}>🌬️</span> Wind: <strong>{day.wind_speed} m/s</strong></p>
            <p><span className={styles.icon}>☁️</span> {day.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
