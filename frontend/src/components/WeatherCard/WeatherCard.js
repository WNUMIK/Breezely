import React from 'react';
import Lottie from 'react-lottie-player';
import sunAnimation from '../animations/sun.json';
import rainAnimation from '../animations/rain.json';
import cloudAnimation from '../animations/cloud.json';
import styles from './WeatherCard.module.css'; // For common styles

const WeatherCard = ({ city, weatherData, onClick, customStyle }) => {
    const getWeatherAnimation = (description) => {
        if (description.includes('clear')) return sunAnimation;
        if (description.includes('rain')) return rainAnimation;
        if (description.includes('cloud')) return cloudAnimation;
        return null; // Default for unknown weather conditions
    };

    return (
        <div className={`${styles.card} ${customStyle}`} onClick={() => onClick(city)} style={{ cursor: 'pointer' }}>
            <h4>{city}</h4>
            {getWeatherAnimation(weatherData.description) ? (
                <Lottie
                    loop
                    animationData={getWeatherAnimation(weatherData.description)}
                    play
                    style={{ width: 80, height: 80 }}
                />
            ) : (
                <p>No animation available</p>
            )}
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>{weatherData.description}</p>
        </div>
    );
};

export default WeatherCard;
