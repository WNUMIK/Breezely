import React, {useEffect, useState} from 'react';
import SingleCityWeather from '../SingleCityWeather/SingleCityWeather';
import WeatherComparison from '../WeatherComparison/WeatherComparison';
import FeaturedCities from '../FeaturedCities/FeaturedCities';
import FavoriteCities from '../FavoriteCities/FavoriteCities';
import InteractiveMap from "../InteractiveMap/InteractiveMap";
import styles from './App.module.css';
import axios from 'axios';

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');
    const [locationWeather, setLocationWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapWeather, setMapWeather] = useState(null);
    const [citiesWeather, setCitiesWeather] = useState([]);
    const [favoriteCities, setFavoriteCities] = useState(
        JSON.parse(localStorage.getItem('favoriteCities')) || []
    );
    const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
    const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

    // Geolocation-based weather fetching logic
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    setLoading(true); // Start loading
                    try {
                        const response = await axios.get('http://127.0.0.1:5000/api/weather', {
                            params: {lat: latitude, lon: longitude},
                        });
                        setLocationWeather(response.data);
                    } catch (err) {
                        if (!err.response) {
                            setError('Network error. Please check your connection.');
                        } else {
                            setError('Failed to fetch weather data for your location.');
                        }
                    } finally {
                        setLoading(false); // Stop loading
                    }
                },
                (err) => {
                    setError('Geolocation permission denied. Please search by city name.');
                    setLoading(false); // Stop loading if geolocation is denied
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            setLoading(false); // Stop loading if geolocation is unsupported
        }
    }, []);

    const addFavoriteCity = async (cityName) => {
        const MAX_FAVORITES = 6;

        if (favoriteCities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
            alert(`${cityName} is already in your favorite cities.`);
            return;
        }

        if (favoriteCities.length >= MAX_FAVORITES) {
            alert(`You can only add up to ${MAX_FAVORITES} favorite cities.`);
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:5000/api/weather', {
                params: {city: cityName}
            });
            const weatherData = response.data.current_weather;

            setFavoriteCities(prevFavorites => {
                const updatedFavorites = [
                    ...prevFavorites,
                    {name: cityName, weatherData: weatherData} // Add new city
                ];
                localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites)); // Save to localStorage
                return updatedFavorites;
            });
        } catch (err) {
            console.error(`Failed to fetch weather data for ${cityName}.`, err);
        }
    };

    // Remove a city from the favorites list
    const removeFavoriteCity = (cityName) => {
        setFavoriteCities(prevFavorites => {
            const updatedFavorites = prevFavorites.filter(city => city.name !== cityName);
            localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites)); // Update localStorage
            return updatedFavorites;
        });
    };

    const handleCityClick = (selectedCity) => {
        setCity(selectedCity);
        setView('singleCity');
    };

    const handleMapWeather = (weatherData) => {
        setMapWeather(weatherData);
        setView('mapWeather');
    };

    const toggleFeatured = () => {
        setIsFeaturedOpen(!isFeaturedOpen);
    };

    const toggleFavorite = () => {
        setIsFavoriteOpen(!isFavoriteOpen);
    };

    const handleSearch = () => {
        if (!city.trim()) {
            setError("Please enter a valid city name.");
            return;
        }
        setError(null);
        setView('singleCity');
    };

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.logo} onClick={() => setView(null)} style={{cursor: 'pointer'}}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Breezely Logo"/>
                </div>
                {loading ? (
                            <div className={styles.loading}>
                                <p>Loading weather data...</p>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div>
                                        <p>{error}</p>
                                        <p>Please use the search bar above to find weather by city.</p>
                                    </div>
                                )}
                                {!error && locationWeather && (
                                    <div className={styles.locationWeatherCard}
                                         onClick={() => handleCityClick(locationWeather.city)}>
                                        <h3>📍 {locationWeather.city}</h3>
                                        <p>{locationWeather.current_weather.temperature}°C</p>
                                        <p>{locationWeather.current_weather.description}</p>
                                    </div>
                                )}
                            </>
                        )}
            </header>

            <div className={styles.container}>
                {!view && (
                    <>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Search weather by city"
                                aria-label="Search weather by city"
                            />
                            <button onClick={handleSearch} aria-label="Search for weather by city">Search</button>
                            <button onClick={() => setView('comparison')}
                                    aria-label="Compare weather in multiple cities">
                                Compare Weather in Multiple Cities
                            </button>
                        </div>
                        <div className={styles.card}>
                            <h3>Click on the map to get weather details</h3>
                            <InteractiveMap setWeatherData={handleMapWeather}/>
                        </div>

                        {/* Collapsible for Featured Cities */}
                        <div className={styles.card}>
                            <div className={styles.collapsibleHeader} onClick={toggleFeatured}>
                                {isFeaturedOpen ? 'Hide Featured Cities' : 'Show Featured Cities'}
                            </div>
                            {isFeaturedOpen && <FeaturedCities onCityClick={handleCityClick}/>}
                        </div>

                        {/* Collapsible for Favorite Cities */}
                        <div className={styles.card}>
                            <div className={styles.collapsibleHeader} onClick={toggleFavorite}>
                                {isFavoriteOpen ? 'Hide Favorite Cities' : 'Show Favorite Cities'}
                            </div>
                            {isFavoriteOpen && (
                                <FavoriteCities
                                    favoriteCities={favoriteCities}
                                    onCityClick={handleCityClick}
                                    onRemoveCity={removeFavoriteCity}
                                />
                            )}
                        </div>
                    </>
                )}

                {view === 'singleCity' && <SingleCityWeather city={city} onBack={() => setView(null)}/>}
                {view === 'comparison' && (
                    <WeatherComparison
                        citiesWeather={citiesWeather} // Pass citiesWeather state
                        setCitiesWeather={setCitiesWeather} // Pass setter function
                        onBack={() => setView(null)} // Back to main view
                    />
                )}
            </div>

            <footer className={styles.footer}>
                <p>© 2024 Breezly | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
