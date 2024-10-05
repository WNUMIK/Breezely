import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import Slider from "react-slick";
import Lottie from 'react-lottie-player';
import sunAnimation from '../animations/sun.json';
import rainAnimation from '../animations/rain.json';
import cloudAnimation from '../animations/cloud.json';
import styles from './FavoriteCities.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Import slick CSS

function FavoriteCities({onCityClick}) {
    const [favoriteCities, setFavoriteCities] = useState(
        JSON.parse(localStorage.getItem('favoriteCities')) || []
    );
    const [favoriteCitiesWeather, setFavoriteCitiesWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorite cities weather
    const fetchFavoriteCitiesWeather = useCallback(async () => {
        try {
            const weatherPromises = favoriteCities.map((city) =>
                axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city}})
            );
            const weatherData = await Promise.all(weatherPromises);
            const weatherMap = weatherData.reduce((acc, response, index) => {
                acc[favoriteCities[index]] = response.data.current_weather;
                return acc;
            }, {});
            setFavoriteCitiesWeather(weatherMap);
            setLoading(false);
        } catch (err) {
            setError('Error fetching weather data for favorite cities');
            setLoading(false);
        }
    }, [favoriteCities]);

    useEffect(() => {
        if (favoriteCities.length > 0) {
            fetchFavoriteCitiesWeather();
        } else {
            setLoading(false);
        }

        const syncFavoriteCities = () => {
            setFavoriteCities(JSON.parse(localStorage.getItem('favoriteCities')) || []);
        };
        window.addEventListener('storage', syncFavoriteCities);

        return () => window.removeEventListener('storage', syncFavoriteCities);
    }, [favoriteCities, fetchFavoriteCitiesWeather]);

    // Remove city from favorites and update localStorage
    const removeCity = useCallback((city) => {
        const updatedFavorites = favoriteCities.filter(favCity => favCity !== city);
        setFavoriteCities(updatedFavorites);
        localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    }, [favoriteCities]);

    // Add city to favorites, preventing duplicates
    const addCity = useCallback((city) => {
        if (favoriteCities.includes(city)) {
            alert(`${city} is already in your favorite cities.`);
            return;
        }

        const updatedFavorites = [...favoriteCities, city];
        setFavoriteCities(updatedFavorites);
        localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    }, [favoriteCities]);

    // Determine weather animation based on description
    const getWeatherAnimation = (description) => {
        if (description.includes('clear')) {
            return sunAnimation;
        } else if (description.includes('rain')) {
            return rainAnimation;
        } else if (description.includes('cloud')) {
            return cloudAnimation;
        }
        return null; // Default case if no match
    };

    // Slider settings
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5, // Show 3 cities at a time
        slidesToScroll: 1,
        lazyLoad: 'ondemand', // Lazy load slides for better performance
        adaptiveHeight: true, // Ensure height adapts to content
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1, // Adjust for smaller screens
                    adaptiveHeight: true, // Ensure adaptive height for smaller screens as well

                }
            }
        ]
    };

    if (loading) {
        return <p>Loading favorite cities...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={fetchFavoriteCitiesWeather}>Retry</button>
            </div>
        );
    }

    // Conditionally render either the slider or a grid layout
    return (
        <div className={styles.favoriteCitiesContainer}>
            <h3>Your Favorite Cities</h3>
            {favoriteCities.length === 0 ? (
                <p>No favorite cities added yet.</p>
            ) : favoriteCities.length > 3 ? (  // Use slider when there are more than 3 cities
                <Slider {...settings}>
                    {favoriteCities.map((city, index) => (
                        <div key={index} className={styles.favoriteCityCard}>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                removeCity(city);
                            }} className={styles.removeButton}>×
                            </button>
                            <div className={styles.weatherDetails} onClick={() => onCityClick(city)}>
                                <h3>{city}</h3>
                                {favoriteCitiesWeather[city] ? (
                                    <>
                                        {getWeatherAnimation(favoriteCitiesWeather[city].description) && (
                                            <Lottie
                                                loop
                                                animationData={getWeatherAnimation(favoriteCitiesWeather[city].description)}
                                                play
                                                style={{width: 80, height: 80, margin: '0 auto'}}
                                            />
                                        )}
                                        <p className={styles.cityTemperature}>
                                            Temperature: {favoriteCitiesWeather[city].temperature}°C
                                        </p>
                                        <p>{favoriteCitiesWeather[city].description}</p>
                                    </>
                                ) : (
                                    <p>Loading weather...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (  // Render as a grid when there are 3 or fewer cities
                <div className={styles.favoriteCitiesGrid}>
                    {favoriteCities.map((city, index) => (
                        <div key={index} className={styles.favoriteCityCard}>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                removeCity(city);
                            }} className={styles.removeButton}>×
                            </button>
                            <div className={styles.weatherDetails} onClick={() => onCityClick(city)}>
                                <h3>{city}</h3>
                                {favoriteCitiesWeather[city] ? (
                                    <>
                                        {getWeatherAnimation(favoriteCitiesWeather[city].description) && (
                                            <Lottie
                                                loop
                                                animationData={getWeatherAnimation(favoriteCitiesWeather[city].description)}
                                                play
                                                style={{width: 80, height: 80, margin: '0 auto'}}
                                            />
                                        )}
                                        <p className={styles.cityTemperature}>
                                            Temperature: {favoriteCitiesWeather[city].temperature}°C
                                        </p>
                                        <p>{favoriteCitiesWeather[city].description}</p>
                                    </>
                                ) : (
                                    <p>Loading weather...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoriteCities;
