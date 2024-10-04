import React, { useState } from 'react';
import styles from './WeatherInput.module.css';

function WeatherInput({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim() !== '') {
      onSearch(city);
    }
  };

  return (
    <div className={styles.weatherInputContainer}>
      <input
        type="text"
        className={styles.inputField}
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default WeatherInput;
