import React, { useState } from 'react';
import './App.css';
import SingleCityWeather from './components/SingleCityWeather';
import WeatherComparison from './components/WeatherComparison';
import FeaturedCities from './components/FeaturedCities'; // Import the FeaturedCities component

function App() {
  const [view, setView] = useState(null);
  const [city, setCity] = useState('');

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
              <h2>What would you like to do?</h2>
              <div className="view-selection-buttons">
                <button onClick={() => handleViewChange('singleCity')}>Get Weather for One City</button>
                <button onClick={() => handleViewChange('comparison')}>Compare Weather in Multiple Cities</button>
              </div>
            </div>

            {/* Add the FeaturedCities component */}
            <FeaturedCities />
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
