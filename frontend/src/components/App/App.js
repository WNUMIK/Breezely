import React, { useState } from 'react';
import SingleCityWeather from '../cities/SingleCityWeather/SingleCityWeather';
import WeatherComparison from '../weather/WeatherComparison/WeatherComparison';
import FeaturedCities from '../cities/FeaturedCities/FeaturedCities';
import FavoriteCities from '../cities/FavoriteCities/FavoriteCities';
import InteractiveMap from "../ui/InteractiveMap/InteractiveMap";
import SearchBar from '../ui/SearchBar/SearchBar';
import CollapsibleSection from '../ui/CollapsibleSection/CollapsibleSection';
import { useWeatherData } from '../hooks/useWeatherData';
import styles from './App.module.css';

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');
    const { weatherData, loading, error } = useWeatherData();

    const handleCityClick = (selectedCity) => {
        setCity(selectedCity);
        setView('singleCity');
    };

    const handleBack = () => {
        setView(null); // Switch back to the main view when the back button is pressed
    };

    const handleSearch = () => {
        if (!city.trim()) {
            alert("Please enter a valid city name.");
            return;
        }
        setView('singleCity');
    };

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.logo} onClick={() => setView(null)} style={{ cursor: 'pointer' }}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Breezely Logo" />
                </div>
                {loading && <p>Loading weather data...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {weatherData && (
                    <div className={styles.locationWeatherCard} onClick={() => handleCityClick(weatherData.city)}>
                        <h3>📍 {weatherData.city}</h3>
                        <p>{weatherData.current_weather.temperature}°C</p>
                        <p>{weatherData.current_weather.description}</p>
                    </div>
                )}
            </header>

            <div className={styles.container}>
                {!view && (
                    <>
                        <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />
                        <InteractiveMap />
                        <CollapsibleSection title="Featured Cities" defaultOpen={true}>
                            <FeaturedCities onCityClick={handleCityClick} />
                        </CollapsibleSection>
                        <CollapsibleSection title="Favorite Cities" defaultOpen={false}>
                            <FavoriteCities />
                        </CollapsibleSection>
                    </>
                )}

                {view === 'singleCity' && <SingleCityWeather city={city} onBack={handleBack} />}
                {view === 'comparison' && <WeatherComparison />}
            </div>

            <footer className={styles.footer}>
                <p>© 2024 Breezly | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
