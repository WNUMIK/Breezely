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
                        </div>
                        {loading ? (
                            <div className={styles.loading}>
                                <p>Loading weather data...</p>
                            </div>
                        ) : (
                            <>
                                {/* Display geolocation-based weather if available */}
                                {error && (
                                    <div>
                                        <p>{error}</p>
                                        <p>Please use the search bar above to find weather by city.</p>
                                    </div>
                                )}
                                {!error && locationWeather && (
                                    <div className={styles.locationWeatherCard}>
                                        <div className={styles.locationWeatherCardIcon}>
                                            {/* Adjust icon size for more emphasis */}
                                            🌦️
                                        </div>
                                        <h3>
                                            Weather for your location
                                            <span className={styles.geoIcon}>📍</span>
                                        </h3>
                                        {/* Emphasize the city name */}
                                        <p className={styles.cityName}>{locationWeather.city}</p>
                                        <p>Temperature: {locationWeather.current_weather.temperature}°C</p>
                                        <p>Description: {locationWeather.current_weather.description}</p>
                                    </div>
                                )}
                            </>
                        )}
                        {/* Existing functionality for views */}
                        <div className={styles.viewSelection}>
                            <h2>What would you like to do?</h2>
                            <div className={styles.viewSelectionButtons}>
                                <button onClick={() => handleViewChange('singleCity')}>Get Weather for One City</button>
                                <button onClick={() => handleViewChange('comparison')}>Compare Weather in Multiple
                                    Cities
                                </button>
                            </div>
                        </div>

                        <FeaturedCities onCityClick={handleCityClick}/>
                        <FavoriteCities/>
                    </>
                )}

                {view === 'singleCity' && <SingleCityWeather city={city} onBack={() => setView(null)}/>}
                {view === 'comparison' && <WeatherComparison onBack={() => setView(null)}/>}
            </div>

            <footer className={styles.footer}>
                <p>© 2024 Breezly | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
