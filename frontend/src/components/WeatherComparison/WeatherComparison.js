import React from 'react';
import CurrentWeatherCard from '../CurrentWeatherCard/CurrentWeatherCard';
import styles from './WeatherComparison.module.css';

function WeatherComparison({ citiesWeather }) {
  return (
    <div className={styles.weatherComparisonContainer}>
      <h3 className={styles.weatherComparisonTitle}>Weather Comparison</h3>
      <div className={styles.comparisonGrid}>
        {citiesWeather.map((cityWeather, index) => (
          <CurrentWeatherCard
            key={index}
            city={cityWeather.city}
            temperature={cityWeather.temperature}
            description={cityWeather.description}
            humidity={cityWeather.humidity}
            windSpeed={cityWeather.wind_speed}
          />
        ))}
      </div>
    </div>
  );
}

export default WeatherComparison;
