import React, {useEffect, useState} from 'react';
import axios from 'axios';
import WeatherChart from './WeatherChart';
import ForecastCard from './ForecastCard';
import Lottie from 'react-lottie-player';
import sunAnimation from './animations/sun.json';
import rainAnimation from './animations/rain.json';
import cloudAnimation from './animations/cloud.json';
import '../css/styles.css'; // Custom styling
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function SingleCityWeather({city, onBack}) {
    const [currentCity, setCurrentCity] = useState(city);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteButtonText, setFavoriteButtonText] = useState('Save as Favorite');
    const [favoriteButtonColor, setFavoriteButtonColor] = useState('#eee8aa');

    const [season, setSeason] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // New state to hold location coordinates
    const [coordinates, setCoordinates] = useState(null); // Default to null to avoid undefined errors

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (currentCity) {
                setLoading(true);
                setError('');

                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city: currentCity}});
                    setWeatherData(response.data.current_weather);
                    setForecastData(response.data.forecast);
                    setSeason(response.data.season);
                    setSuggestions(response.data.suggestions);

                    // Check for lat/lon in the response
                    if (response.data.lat && response.data.lon) {
                        setCoordinates({lat: response.data.lat, lon: response.data.lon});
                    } else {
                        setCoordinates(null);  // Fallback if no coordinates available
                    }

                    setError('');
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
        if (description.includes('clear')) return sunAnimation;
        if (description.includes('rain')) return rainAnimation;
        if (description.includes('cloud')) return cloudAnimation;
    };

    const handleSearch = () => {
        if (currentCity.trim()) {
            setCurrentCity(currentCity);
        }
    };

    const saveFavoriteCity = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];

        if (!isFavorite) {
            favorites.push(currentCity);
            localStorage.setItem('favoriteCities', JSON.stringify(favorites));
            setIsFavorite(true);
            setFavoriteButtonText('Added as Favorite');
            setFavoriteButtonColor('#98FB98');
        } else {
            const updatedFavorites = favorites.filter(favCity => favCity !== currentCity);
            localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
            setIsFavorite(false);
            setFavoriteButtonText('Save as Favorite');
            setFavoriteButtonColor('#eee8aa');
        }
    };

    return (
        <div className="dashboard">
            <div className="header-buttons-row">
                <button className="back-button" onClick={onBack}>Back</button>
                <div className="input-section">
                    <input type="text" placeholder="Enter city" value={currentCity}
                           onChange={(e) => setCurrentCity(e.target.value)}/>
                    <button className="input-section-button" onClick={handleSearch}>Search</button>
                </div>
                <button className="favorite-button" onClick={saveFavoriteCity}
                        style={{backgroundColor: favoriteButtonColor}}>
                    {favoriteButtonText}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {weatherData && (
                <div className="weather-dashboard">
                    <div className="weather-card card">
                        <h3>Current Weather in {currentCity}</h3>
                        <p>{weatherData.temperature}°C</p>
                        <p>{weatherData.description}</p>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                        <p>Season: {season}</p>
                        {suggestions && suggestions.length > 0 && (
                            <ul>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="weather-animation card">
                        <Lottie loop animationData={getWeatherAnimation(weatherData.description)} play
                                style={{width: '150px', height: '150px'}}/>
                    </div>

                    {forecastData && (
                        <div className="forecast-chart card">
                            <WeatherChart weather={{forecast: forecastData}}/>
                        </div>
                    )}

                    {coordinates && (
                        <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={10}
                                      style={{height: "300px", width: "100%"}}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[coordinates.lat, coordinates.lon]}>
                                <Popup>Weather data for {currentCity}</Popup>
                            </Marker>
                        </MapContainer>
                    )}


                    {forecastData && (
                        <div className="forecast-card-container card">
                            <ForecastCard forecast={forecastData}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SingleCityWeather;
