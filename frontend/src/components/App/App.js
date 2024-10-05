import React, {useEffect, useState} from 'react';
import SingleCityWeather from '../SingleCityWeather/SingleCityWeather';
import WeatherComparison from '../WeatherComparison/WeatherComparison';
import FeaturedCities from '../FeaturedCities/FeaturedCities';
import FavoriteCities from '../FavoriteCities/FavoriteCities';
import styles from './App.module.css'; // CSS Module for App-specific styles
import axios from 'axios'; // For making API calls

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');
    const [locationWeather, setLocationWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [citiesWeather, setCitiesWeather] = useState([]); // New state for cities comparison
    const [favoriteCities, setFavoriteCities] = useState(
        JSON.parse(localStorage.getItem('favoriteCities')) || []
    );

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

    // Add a city to the favorites list
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

    // Existing logic for view and city search
    const handleViewChange = (viewType) => {
        setView(viewType);
    };

    const goToHomePage = () => {
        setView(null);
    };

    const handleCityClick = (selectedCity) => {
        setCity(selectedCity);
        setView('singleCity');
    };

    const handleSearch = () => {
        if (!city.trim()) {
            setError("Please enter a valid city name.");
            return;
        }
        setError(null); // Clear previous errors
        setView('singleCity');
    };


    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.logo} onClick={goToHomePage} style={{cursor: 'pointer'}}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Breezely Logo"/>
                </div>
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
                            <button onClick={handleSearch} aria-label="Search for weather by city">
                                Search
                            </button>
                            <button onClick={() => handleViewChange('comparison')}
                                    aria-label="Compare weather in multiple cities">
                                Compare Weather in Multiple Cities
                            </button>
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
                                    <div
                                        className={styles.locationWeatherCard}
                                        onClick={() => handleCityClick(locationWeather.city)} // Click to go to detailed view
                                    >
                                        <div className={styles.locationWeatherCardIcon}>
                                            🌦️
                                        </div>
                                        <h3>
                                            Weather for your location
                                            <span className={styles.geoIcon}>📍</span>
                                        </h3>
                                        <p className={styles.cityName}>{locationWeather.city}</p>
                                        <p>Temperature: {locationWeather.current_weather.temperature}°C</p>
                                        <p>Description: {locationWeather.current_weather.description}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Grid Layout for Featured and Favorite Cities */}
                        <div className={styles.weatherGrids}>
                            <FeaturedCities onCityClick={handleCityClick}/>
                            <FavoriteCities
                                favoriteCities={favoriteCities}
                                onCityClick={handleCityClick}
                                onRemoveCity={removeFavoriteCity}
                            />
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
                )}            </div>

            <footer className={styles.footer}>
                <p>© 2024 Breezly | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
