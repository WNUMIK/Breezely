import { useState, useEffect } from 'react';
import axios from 'axios';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setLoading(true);

          try {
            const response = await axios.get(
              'http://127.0.0.1:5000/api/weather',
              {
                params: { lat: latitude, lon: longitude },
              }
            );
            setWeatherData(response.data);
          } catch (err) {
            setError('Failed to fetch weather data.');
          } finally {
            setLoading(false);
          }
        },
        err => {
          setError('Geolocation permission denied.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  return { weatherData, loading, error };
};
