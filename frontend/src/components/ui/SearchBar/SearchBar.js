import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ city, setCity, onSearch, onCompare }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Search weather by city"
        aria-label="Search weather by city"
      />
      <button onClick={onSearch} className={styles.searchBarButton}>
        Search
      </button>
      <button onClick={onCompare} className={styles.compareButton}>
        Compare Weather
      </button>
    </div>
  );
};

export default SearchBar;
