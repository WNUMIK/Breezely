import React from 'react';
import './App.css'; // Optional: If you want to add styles later
import Weather from './components/Weather';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Weather /> {/* Display the single city weather */}
      </header>
    </div>
  );
}

export default App;
