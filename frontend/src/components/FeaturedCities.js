import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';

const FeaturedCities = ({ onCityClick }) => {
    const [featuredCitiesWeather, setFeaturedCitiesWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const popularCities = ['New York', 'Tokyo', 'Paris', 'London', 'Berlin'];

    useEffect(() => {
        const fetchFeaturedCitiesWeather = async () => {
            try {
                const weatherPromises = popularCities.map((city) =>
                    axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city}})
                );
                const weatherData = await Promise.all(weatherPromises);
                setFeaturedCitiesWeather(weatherData.map((response, index) => ({
                    city: popularCities[index],
                    ...response.data.current_weather
                })));
                setLoading(false);
            } catch (err) {
                setError("Error fetching weather data for featured cities");
                setLoading(false);
            }
        };

        fetchFeaturedCitiesWeather();
    }, []);

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
        return <p>Loading featured cities...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="featured-cities">
            {featuredCitiesWeather.map((weather, index) => (
                <div
                    className="city-tile"
                    key={index}
                    onClick={() => onCityClick(weather.city)} // Call onCityClick when a city tile is clicked
                    style={{ cursor: 'pointer' }} // Add cursor pointer for clickability
                >
                    <h4>{weather.city}</h4>
                    <Lottie
                        loop
                        animationData={getWeatherAnimation(weather.description)}
                        play
                        style={{width: 80, height: 80, margin: "0 auto"}}
                    />
                    <p>Temperature: {weather.temperature}°C</p>
                    <p>{weather.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeaturedCities;
