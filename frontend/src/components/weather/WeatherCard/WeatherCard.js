import React from 'react';
import styles from './WeatherCard.module.css';

const WeatherCard = React.memo(({ city, temperature, description }) => {
    return (
        <div className={styles.weatherCard}>
            <h3>{city}</h3>
            <p>{temperature}°C</p>
            <p>{description}</p>
        </div>
    );
});

export default WeatherCard;
