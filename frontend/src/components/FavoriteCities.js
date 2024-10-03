import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from './CurrentWeatherCard'; // Ensure you import the correct WeatherCard component

const FavoriteCities = () => {
    const [favoriteCities, setFavoriteCities] = useState(JSON.parse(localStorage.getItem('favoriteCities')) || []);
    const [weatherData, setWeatherData] = useState({});

    // Fetch weather data for all favorite cities
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
        // Remove weather data for the deleted city
        const newWeatherData = { ...weatherData };
        delete newWeatherData[city];
        setWeatherData(newWeatherData);
    };

    useEffect(() => {
        // Fetch weather data for each favorite city
        favoriteCities.forEach(city => fetchWeatherData(city));
    }, [favoriteCities]); // Fetch data when favorite cities change

    return (
        <div>
            <h3>Your Favorite Cities</h3>
            {favoriteCities.length > 0 ? (
                <div className="favorite-cities">
                    {favoriteCities.map((city, index) => (
                        <div key={index} className="favorite-city-card">
                            <WeatherCard city={city} weather={weatherData[city]} />
                            <button onClick={() => handleDelete(city)} style={{ backgroundColor: 'gold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No favorite cities added.</p>
            )}
        </div>
    );
};

export default FavoriteCities;
