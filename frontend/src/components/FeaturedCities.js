import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';  // Import Lottie JSON files for weather animations
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';

const FeaturedCities = () => {
    const [featuredCitiesWeather, setFeaturedCitiesWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // List of popular cities to fetch weather for
    const popularCities = ['New York', 'Tokyo', 'Paris', 'London', 'Berlin'];

    // Function to fetch weather data for popular cities
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

    // Function to return the correct animation based on weather description
    const getWeatherAnimation = (description) => {
        if (description.includes('clear')) {
            return sunAnimation;
        } else if (description.includes('rain')) {
            return rainAnimation;
        } else if (description.includes('cloud')) {
            return cloudAnimation;
        }
        // Add more weather conditions here
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
                <div className="city-tile" key={index}>
                    <h4>{weather.city}</h4>
                    <Lottie
                        loop
                        animationData={getWeatherAnimation(weather.description)} // Load the appropriate animation
                        play
                        style={{width: 80, height: 80, margin: "0 auto"}}  // Adjust the size and center the animation
                    />

                    <p>Temperature: {weather.temperature}°C</p>
                    <p>{weather.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeaturedCities;
