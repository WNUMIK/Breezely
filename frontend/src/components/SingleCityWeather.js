import React, {useEffect, useState} from 'react';
import axios from 'axios';
import WeatherCard from './CurrentWeatherCard'; // Component to display current weather
import WeatherChart from './WeatherChart'; // Component to display temperature chart
import ForecastCard from './ForecastCard'; // Component to display 5-day forecast
import './css/Weather.css';  // Import CSS for styling

function SingleCityWeather({onBack}) {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to fetch weather data by city
    const fetchWeatherData = async () => {
        if (city.trim() === '') {
            setError('Please enter a city name.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/weather`, {params: {city}});
            setWeatherData(response.data.current_weather);
            setForecastData(response.data.forecast); // Set forecast data for 5 days
        } catch (err) {
            setError('City not found. Please try again.');
            setWeatherData(null);
            setForecastData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="section-title">Weather for a Single City</h2>

            {/* Input for the city */}
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={fetchWeatherData}>Get Weather</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {/* Display current weather */}
            {weatherData && <WeatherCard weather={{city: city, ...weatherData}}/>}


            {/* Display temperature chart and 5-day forecast if available */}
            {forecastData && (
                <>
                    <WeatherChart weather={{forecast: forecastData}}/> {/* Temperature Chart */}
                    <ForecastCard forecast={forecastData}/> {/* 5-day forecast */}
                </>
            )}

            {/* Back Button */}
            <button className="back-button" onClick={onBack}>Back</button>
        </div>
    );
}

export default SingleCityWeather;
