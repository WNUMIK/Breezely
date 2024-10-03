import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WeatherChart({ weather }) {
  const generateChartData = () => {
    if (!Array.isArray(weather.forecast)) {
      return { labels: [], datasets: [] }; // Safeguard for non-array data
    }

    const labels = weather.forecast.map((day) =>
      new Date(day.date).toLocaleDateString()
    );

    const temperatureData = weather.forecast.map((day) => day.temperature);
    const humidityData = weather.forecast.map((day) => day.humidity);
    const precipitationData = weather.forecast.map((day) =>
      day.precipitation !== undefined ? day.precipitation : 0  // Default to 0 if precipitation is missing
    );

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatureData,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
        {
          label: 'Humidity (%)',
          data: humidityData,
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1,
        },
        {
          label: 'Precipitation (mm)',
          data: precipitationData,
          fill: false,
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Line data={generateChartData()} />
      </div>
    </div>
  );
}

export default WeatherChart;
