import { useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import axios from 'axios';

const useMapClickWeather = (setMarker) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setLoading(true);
            setError(null);

            try {
                // Step 1: Reverse geocode to get the city name
                const geocodeResponse = await axios.get('http://127.0.0.1:5000/api/geocode', {
                    params: { lat, lon: lng },
                });

                const cityName = geocodeResponse.data.city;

                // Step 2: Fetch weather data using the city name
                const weatherResponse = await axios.get('http://127.0.0.1:5000/api/weather', {
                    params: { city: cityName },
                });

                const weatherData = weatherResponse.data.current_weather;

                // Step 3: Only set the marker after both the city name and weather data are fetched
                setMarker({
                    lat,
                    lon: lng,
                    cityName,
                    temperature: weatherData.temperature,
                    description: weatherData.description,
                });
            } catch (err) {
                setError('Failed to fetch city or weather data.');
            } finally {
                setLoading(false);  // Stop loading
            }
        },
    });

    return { loading, error };  // Return loading and error states
};

export default useMapClickWeather;
