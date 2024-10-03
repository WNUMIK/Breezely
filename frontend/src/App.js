import React, { useState } from 'react';
import './App.css';
import SingleCityWeather from './components/SingleCityWeather';
import WeatherComparison from './components/WeatherComparison';

function App() {
  const [view, setView] = useState(null);

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const goToHomePage = () => {
    setView(null); // Reset the view to show the homepage
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
          <div className="view-selection">
            <h2>What would you like to do?</h2>
            <div className="view-selection-buttons">
              <button onClick={() => handleViewChange('singleCity')}>Get Weather for One City</button>
              <button onClick={() => handleViewChange('comparison')}>Compare Weather in Multiple Cities</button>
            </div>
          </div>
        )}

        {view === 'singleCity' && <SingleCityWeather onBack={() => setView(null)} />}
        {view === 'comparison' && <WeatherComparison onBack={() => setView(null)} />}
      </div>

      <footer>
        <p>© 2024 Breezely | Contact Us | Privacy Policy</p>
      </footer>
    </div>
  );
}

export default App;
