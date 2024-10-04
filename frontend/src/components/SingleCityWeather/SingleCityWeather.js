import React, {useEffect, useState} from 'react';
import axios from 'axios';
import WeatherChart from '../WeatherChart/WeatherChart';
import ForecastCard from '../ForecastCard/ForecastCard';
import Lottie from 'react-lottie-player';
import sunAnimation from '../animations/sun.json';
import rainAnimation from '../animations/rain.json';
import cloudAnimation from '../animations/cloud.json';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './SingleCityWeather.module.css';

// Fix for marker icons issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

    const [coordinates, setCoordinates] = useState({lat: 35.6895, lon: 139.6917}); // Default to Tokyo

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (currentCity) {
                setLoading(true);
                setError('');

                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city: currentCity}});
                    setWeatherData(response.data.current_weather);

                    // Ensure forecast data is an array or properly structured
                    if (Array.isArray(response.data.forecast)) {
                        setForecastData(response.data.forecast);
                    } else {
                        setForecastData([]);
                    }

                    setSeason(response.data.season);
                    setSuggestions(response.data.suggestions);

                    if (response.data.lat && response.data.lon) {
                        setCoordinates({lat: response.data.lat, lon: response.data.lon});
                    } else {
                        console.error('Coordinates not found in the API response.');
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
        <div className={styles.dashboard}>
            <div className={styles.headerButtonsRow}>
                <button className={styles.backButton} onClick={onBack}>Back</button>
                <div className={styles.inputSection}>
                    <input className={styles.inputField} type="text" placeholder="Enter city" value={currentCity}
                           onChange={(e) => setCurrentCity(e.target.value)}/>
                    <button className={styles.inputButton} onClick={handleSearch}>Search</button>
                </div>
                <button className={styles.favoriteButton} onClick={saveFavoriteCity}
                        style={{backgroundColor: favoriteButtonColor}}>
                    {favoriteButtonText}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {weatherData && (
                <div className={styles.weatherDashboard}>
                    <div className={styles.weatherCard}>
                        <h3>Current Weather in {currentCity}</h3>
                        <p>{weatherData.temperature}°C</p>
                        <p>{weatherData.description}</p>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                        <p>Season: {season}</p>
                    </div>

                    <div className={styles.weatherAnimation}>
                        <Lottie loop animationData={getWeatherAnimation(weatherData.description)} play
                                style={{width: '100px', height: '100px'}}/>
                    </div>

                    <div className={styles.suggestions}>
                        <h4>Suggestions</h4>
                        <ul>
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.weatherMap}>
                        <h4>Map of {currentCity}</h4>
                        <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={10}
                                      style={{height: "300px", width: "300px"}}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[coordinates.lat, coordinates.lon]}>
                                <Popup>Weather data for {currentCity}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <div className={styles.forecastData}>
                        <h4>Forecast Weather for {currentCity}</h4>
                        {forecastData && (
                            <div className={styles.forecastCards}>
                                {forecastData.map((forecast, index) => (
                                    <div key={index} className={styles.forecastCardContainer}>
                                        <h5>{forecast.date}</h5>
                                        <p>Temperature: {forecast.temperature}°C</p>
                                        <p>Description: {forecast.description}</p>
                                        <p>Humidity: {forecast.humidity}%</p>
                                        <p>Wind Speed: {forecast.wind_speed} m/s</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default SingleCityWeather;
