import React, { useState } from 'react';
import './App.css';
import SingleCityWeather from './components/SingleCityWeather';
import WeatherComparison from './components/WeatherComparison';
import FeaturedCities from './components/FeaturedCities';

function App() {
    const [view, setView] = useState(null);
    const [city, setCity] = useState('');

    const handleViewChange = (viewType) => {
        setView(viewType);
    };

    const goToHomePage = () => {
        setView(null);
        setCity(''); // Clear the city input when going back to the homepage
    };

    const handleSearch = () => {
        if (city.trim()) {
            setView('singleCity'); // Set view to singleCity
        }
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
                            <h2>Maybe you want to compare couple cities?</h2>
                            <div className="view-selection-buttons">
                                <button onClick={() => handleViewChange('comparison')}>Yes</button>
                            </div>
                        </div>

                        <FeaturedCities />
                    </>
                )}

                {view === 'singleCity' && <SingleCityWeather city={city} onBack={goToHomePage} />}
                {view === 'comparison' && <WeatherComparison onBack={goToHomePage} />}
            </div>

            <footer>
                <p>© 2024 Breezely | Contact Us | Privacy Policy</p>
            </footer>
        </div>
    );
}

export default App;
