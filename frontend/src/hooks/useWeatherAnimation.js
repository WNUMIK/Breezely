import { useMemo } from 'react';
import sunAnimation from '../components/animations/sun.json';
import rainAnimation from '../components/animations/rain.json';
import cloudAnimation from '../components/animations/cloud.json';

const useWeatherAnimation = (description) => {
  return useMemo(() => {
    if (description.includes('clear')) {
      return sunAnimation;
    } else if (description.includes('rain')) {
      return rainAnimation;
    } else if (description.includes('cloud')) {
      return cloudAnimation;
    }
    return null;
  }, [description]);
};

export default useWeatherAnimation;