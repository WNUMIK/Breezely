import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WeatherChart({ weather }) {
  const generateChartData = () => {
    const labels = weather.forecast.map((day) =>
      new Date(day.date).toLocaleDateString()
    );
    const temperatureData = weather.forecast.map((day) => day.temperature);

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
      ],
    };
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        {/* Use the key prop to force re-rendering */}
        <Line data={generateChartData()} key={weather.city} />
      </div>
    </div>
  );
}

export default WeatherChart;
