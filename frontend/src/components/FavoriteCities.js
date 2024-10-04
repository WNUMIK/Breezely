import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';

const FavoriteCities = () => {
    const [favoriteCities, setFavoriteCities] = useState(JSON.parse(localStorage.getItem('favoriteCities')) || []);
    const [weatherData, setWeatherData] = useState({});

    const fetchWeatherData = async (city) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/weather`, { params: { city } });
            setWeatherData(prevState => ({ ...prevState, [city]: response.data.current_weather }));
        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
        }
    };

    const handleDelete = (city) => {
        const updatedFavorites = favoriteCities.filter(favCity => favCity !== city);
        setFavoriteCities(updatedFavorites);
        localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    };

    const refreshWeather = (city) => {
        fetchWeatherData(city);  // Add refresh functionality
    };

    const getWeatherAnimation = (description) => {
        if (!description) return null;
        if (description.includes('clear')) return sunAnimation;
        if (description.includes('rain')) return rainAnimation;
        if (description.includes('cloud')) return cloudAnimation;
        return null;
    };

    return (
        <>
            {favoriteCities.length > 0 ? (
                <div>
                    <h3>Your Favorite Cities</h3>
                    <div className="favorite-cities">
                        {favoriteCities.map((city, index) => (
                            <div key={index} className="favorite-city-card">
                                <div className="remove-button" onClick={() => handleDelete(city)}>
                                    <span className="remove-icon">−</span>
                                </div>
                                <h3>{city}</h3>
                                <Lottie
                                    loop
                                    animationData={getWeatherAnimation(weatherData[city]?.description)}
                                    play
                                    style={{ width: 80, height: 80, margin: "0 auto" }}
                                />
                                <p>Temperature: {weatherData[city]?.temperature}°C</p>
                                <p>{weatherData[city]?.description}</p>
                                <button onClick={() => refreshWeather(city)}>Refresh</button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default FavoriteCities;