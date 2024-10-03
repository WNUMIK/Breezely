import React from 'react';
import './App.css';  // Optional: If you want to add styles later
import Weather from './component/Weather';  // Import the Weather component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Breezely - Weather App</h1>
        <Weather />
      </header>
    </div>
  );
}

export default App;
