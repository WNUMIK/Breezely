import React from 'react';
import './App.css';  // Optional: If you want to add styles later
import Weather from './components/Weather';  // Import the Weather components

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Weather />
      </header>
    </div>
  );
}

export default App;
