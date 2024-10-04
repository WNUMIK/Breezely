import React, { useState } from 'react';
import SingleCityWeather from '../SingleCityWeather/SingleCityWeather';
import WeatherComparison from '../WeatherComparison/WeatherComparison';
import FeaturedCities from '../FeaturedCities/FeaturedCities';
import FavoriteCities from '../FavoriteCities/FavoriteCities';
import styles from './App.module.css'; // CSS Module for App-specific styles

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');

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
        if (city.trim()) {
            setView('singleCity');
        }
    };

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.logo} onClick={goToHomePage} style={{ cursor: 'pointer' }}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Breezely Logo" />
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
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>

                        <div className={styles.viewSelection}>
                            <h2>What would you like to do?</h2>
                            <div className={styles.viewSelectionButtons}>
                                <button onClick={() => handleViewChange('singleCity')}>Get Weather for One City</button>
                                <button onClick={() => handleViewChange('comparison')}>Compare Weather in Multiple Cities</button>
                            </div>
                        </div>

                        <FeaturedCities onCityClick={handleCityClick} />
                        <FavoriteCities />
                    </>
                )}

                {view === 'singleCity' && <SingleCityWeather city={city} onBack={() => setView(null)} />}
                {view === 'comparison' && <WeatherComparison onBack={() => setView(null)} />}
            </div>

            <footer className={styles.footer}>
                <p>© 2024 Breezly | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
