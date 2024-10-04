import React from 'react';
import styles from './FavoriteCities.module.css';

function FavoriteCities() {
  const [favoriteCities, setFavoriteCities] = React.useState(
    JSON.parse(localStorage.getItem('favoriteCities')) || []
  );

  const removeCity = (city) => {
    const updatedFavorites = favoriteCities.filter(favCity => favCity !== city);
    setFavoriteCities(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
  };

  return (
    <div className={styles.favoriteCitiesContainer}>
      <h3>Your Favorite Cities</h3>
      {favoriteCities.length === 0 ? (
        <p>No favorite cities added yet.</p>
      ) : (
        favoriteCities.map((city, index) => (
          <div key={index} className={styles.favoriteCityCard}>
            <button onClick={() => removeCity(city)} className={styles.removeButton}>×</button>
            <div className={styles.weatherDetails}>
              <h3>{city}</h3>
              {/* Additional weather details can go here */}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FavoriteCities;
