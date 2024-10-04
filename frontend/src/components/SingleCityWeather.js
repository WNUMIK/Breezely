import React, {useEffect, useState} from 'react';
import axios from 'axios';
import WeatherChart from './WeatherChart';
import ForecastCard from './ForecastCard';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';
import './css/Weather.css';

function SingleCityWeather({city, onBack}) {
    const [currentCity, setCurrentCity] = useState(city);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false); // New state for favorite status
    const [favoriteButtonText, setFavoriteButtonText] = useState('Save as Favorite'); // Button text state
    const [favoriteButtonColor, setFavoriteButtonColor] = useState('#eee8aa'); // Initial color

    const [season, setSeason] = useState(''); // New state for season
    const [suggestions, setSuggestions] = useState([]); // New state for suggestions

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (currentCity) {
                setLoading(true);
                setError('');

                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city: currentCity}});
                    setWeatherData(response.data.current_weather);
                    setForecastData(response.data.forecast);

                    // Set season and suggestions
                    setSeason(response.data.season);
                    setSuggestions(response.data.suggestions);

                    setError(''); // Clear error if data is successfully fetched
                } catch (err) {
                    setError('City not found. Please try again.');
                    setWeatherData(null);
                    setForecastData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWeatherData();
    }, [currentCity]);

    const getWeatherAnimation = (description) => {
        if (description.includes('clear')) {
            return sunAnimation;
        } else if (description.includes('rain')) {
            return rainAnimation;
        } else if (description.includes('cloud')) {
            return cloudAnimation;
        }
    };

    const handleSearch = () => {
        if (currentCity.trim()) {
            setCurrentCity(currentCity); // Update the city state
        }
    };

    const saveFavoriteCity = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];

        if (!isFavorite) {
            // If not currently a favorite, add it
            favorites.push(currentCity);
            localStorage.setItem('favoriteCities', JSON.stringify(favorites));
            setIsFavorite(true); // Update state to reflect city is a favorite
            setFavoriteButtonText('Added as Favorite'); // Change button text
            setFavoriteButtonColor('#98FB98'); // Light green color
        } else {
            // If it is a favorite, remove it
            const updatedFavorites = favorites.filter(favCity => favCity !== currentCity);
            localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
            setIsFavorite(false); // Update state to reflect city is no longer a favorite
            setFavoriteButtonText('Save as Favorite'); // Change button text back
            setFavoriteButtonColor('#eee8aa'); // Reset to original color
        }
    };

    return (
        <div>
            <div className="header-buttons">
                <button className="back-button" onClick={onBack}>
                    Back
                </button>
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={currentCity}
                        onChange={(e) => setCurrentCity(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                    {/* Button to search for a new city */}
                </div>
                <button
                    className="favorite-button"
                    onClick={saveFavoriteCity}
                    style={{backgroundColor: favoriteButtonColor}} // Set dynamic background color
                >
                    {favoriteButtonText} {/* Change button text */}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {weatherData && (
                <div className="weather-card">
                    <div className="weather-details">
                        <h3>Current Weather in {currentCity}</h3>
                        <p>{weatherData.temperature}°C</p>
                        <p>{weatherData.description}</p>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                        <p>Season: {season}</p> {/* Display season */}
                        {suggestions && suggestions.length > 0 && (
                            <ul>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="weather-animation">
                        <Lottie
                            loop
                            animationData={getWeatherAnimation(weatherData.description)}
                            play
                            style={{width: '150px', height: '150px'}} // Adjust size as needed
                        />
                    </div>
                </div>
            )}

            {forecastData && (
                <>
                    <WeatherChart weather={{forecast: forecastData}}/>
                    <ForecastCard forecast={forecastData}/>
                </>
            )}
        </div>
    );
}

export default SingleCityWeather;
