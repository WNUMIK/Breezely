import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherChart from '../../weather/WeatherChart/WeatherChart';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './SingleCityWeather.module.css';

// Fix for marker icons issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function SingleCityWeather({ city, onBack }) {
  const [currentCity, setCurrentCity] = useState(city);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteButtonText, setFavoriteButtonText] =
    useState('Save as Favorite');
  const [favoriteButtonColor, setFavoriteButtonColor] = useState('#eee8aa');
  const [season, setSeason] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 35.6895,
    lon: 139.6917,
  }); // Default to Tokyo

  // Check if the current city is already a favorite on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (favorites.includes(currentCity)) {
      setIsFavorite(true);
      setFavoriteButtonText('Added as Favorite');
      setFavoriteButtonColor('#98FB98');
    }
  }, [currentCity]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (currentCity) {
        setLoading(true);
        setError('');

        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/weather`,
            { params: { city: currentCity } }
          );
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
            setCoordinates({ lat: response.data.lat, lon: response.data.lon });
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

  // Add or remove city from favorites
  const saveFavoriteCity = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];

    if (!isFavorite) {
      if (!favorites.includes(currentCity)) {
        favorites.push(currentCity);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        setIsFavorite(true);
        setFavoriteButtonText('Added as Favorite');
        setFavoriteButtonColor('#98FB98');
      } else {
        alert(`${currentCity} is already in your favorite cities.`);
      }
    } else {
      const updatedFavorites = favorites.filter(
        favCity => favCity !== currentCity
      );
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      setFavoriteButtonText('Save as Favorite');
      setFavoriteButtonColor('#eee8aa');
    }
  };

  const handleSearch = () => {
    if (currentCity.trim()) {
      setCurrentCity(currentCity);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerButtonsRow}>
        <button className={styles.backButton} onClick={onBack}>
          Back
        </button>
        <div className={styles.inputSection}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter city"
            value={currentCity}
            onChange={e => setCurrentCity(e.target.value)}
          />
          <button className={styles.inputButton} onClick={handleSearch}>
            Search
          </button>
        </div>
        <button
          className={styles.favoriteButton}
          onClick={saveFavoriteCity}
          style={{ backgroundColor: favoriteButtonColor }}
        >
          {favoriteButtonText}
        </button>
      </div>

      {loading && <div className={styles.loadingSpinner}></div>}

      {error && <p className={styles.error}>{error}</p>}

      {weatherData && (
        <div className={styles.weatherDashboard}>
          <div className={styles.weatherCard}>
            <h3>Current Weather in {currentCity}</h3>
            <p>
              <span className={styles.weatherCardIcon}>🌡️</span>
              <strong>{weatherData.temperature}°C</strong>
            </p>
            <p>
              <span className={styles.weatherCardIcon}>🌧️</span>{' '}
              {weatherData.description}
            </p>
            <p>
              <span className={styles.weatherCardIcon}>💧</span> Humidity:{' '}
              <strong>{weatherData.humidity}%</strong>
            </p>
            <p>
              <span className={styles.weatherCardIcon}>🌬️</span> Wind Speed:{' '}
              <strong>{weatherData.wind_speed} m/s</strong>
            </p>
            <p>
              <span className={styles.weatherCardIcon}>🍂</span> Season:{' '}
              {season}
            </p>
          </div>
          <div className={styles.suggestionsCard}>
            <h4>Suggestions</h4>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className={styles.weatherMap}>
            <MapContainer
              center={[coordinates.lat, coordinates.lon]}
              zoom={10}
              style={{ height: '350px', width: '100%' }} /* Adjust the size */
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coordinates.lat, coordinates.lon]}>
                <Popup>Weather data for {currentCity}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className={styles.forecastData}>
            <h4>Forecast Weather for {currentCity}</h4>

            {forecastData && (
              <div className={styles.forecastCards}>
                {forecastData.map((forecast, index) => {
                  // Convert date to a human-readable day of the week
                  const dateObj = new Date(forecast.date);
                  const dayName = dateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                  });

                  return (
                    <div key={index} className={styles.forecastCardContainer}>
                      <h5>{dateObj.toLocaleDateString()}</h5>
                      <p className={styles.dayName}>{dayName}</p>{' '}
                      {/* Display the day name */}
                      <div className={styles.infoRow}>
                        <p>
                          <span className={styles.icon}>🌡️</span>
                          <strong>{forecast.temperature}°C</strong>
                        </p>
                        <p>
                          <span className={styles.icon}>💧</span> Humidity:{' '}
                          <strong>{forecast.humidity}%</strong>
                        </p>
                      </div>
                      <div className={styles.infoRow}>
                        <p>
                          <span className={styles.icon}>🌬️</span> Wind Speed:{' '}
                          <strong>{forecast.wind_speed} m/s</strong>
                        </p>
                        <p>
                          <span className={styles.icon}>☁️</span>{' '}
                          {forecast.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {forecastData && (
              <div className={styles.chartContainer}>
                <WeatherChart weather={{ forecast: forecastData }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCityWeather;
