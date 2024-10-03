import React, { useState, useEffect } from 'react';
import SingleCityWeather from './components/SingleCityWeather';
import WeatherComparison from './components/WeatherComparison';
import FeaturedCities from './components/FeaturedCities';
import FavoriteCities from './components/FavoriteCities';
import './App.css'

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');
    const [geoLocationCity, setGeoLocationCity] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const response = await fetch(`http://127.0.0.1:5000/api/geo?lat=${lat}&lon=${lon}`);
                const data = await response.json();
                setGeoLocationCity(data.city);
            });
        }
    }, []);

    const handleViewChange = (viewType) => {
        setView(viewType);
    };

    const goToHomePage = () => {
        setView(null);
    };

    const handleSearch = () => {
        if (city.trim()) {
            setView('singleCity');
        }
    };

    const handleCityClick = (selectedCity) => {
        setCity(selectedCity);
        setView('singleCity');
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo" onClick={goToHomePage} style={{ cursor: 'pointer' }}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Breezely Logo" />
                </div>
            </header>

            <div className="container">
                {!view && (
                    <>
                        {geoLocationCity && (
                            <div className="geolocation-weather">
                                <h3>Current Weather in You ar Location ({geoLocationCity})</h3>
                                <SingleCityWeather city={geoLocationCity} />
                            </div>
                        )}

                        <div className="search-bar">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Search weather by city"
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>

                        <div className="view-selection">
                            <h2>What would you like to do?</h2>
                            <div className="view-selection-buttons">
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

            <footer>
                <p>© 2024 Breezely | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
