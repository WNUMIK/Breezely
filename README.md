
# Breezely Weather App

Breezely is a dynamic weather forecasting application built with a modern tech stack. It allows users to fetch weather details for a single city, compare the weather in multiple cities, and view featured popular cities' weather dynamically. Breezely is a demonstration of using React with Flask for a seamless frontend-backend integration.

## Features

1. **Single City Weather**: 
   - Users can input a city name and retrieve the current weather conditions, 5-day weather forecast, and a temperature trend chart.
   - The weather details include temperature, weather description, humidity, and wind speed.
   
2. **Weather Comparison**: 
   - Allows users to compare weather in multiple cities side by side.
   - The comparison provides real-time weather data such as temperature, humidity, and description for each selected city.

3. **Featured Cities**:
   - Displays the current weather for popular cities (e.g., New York, Tokyo, Paris, etc.).
   - This data is fetched dynamically from a weather API upon page load.

4. **Interactive Chart**:
   - The app features an interactive chart that shows temperature trends over five days for a selected city. The chart also includes humidity and precipitation.

5. **Responsive Design**:
   - The application is mobile-friendly and adapts to different screen sizes.
   
## Installation and Setup

To set up and run this project locally, follow these steps:

### Backend (Flask API)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/breezely.git
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

3. **Install dependencies**:
   We are using `pipenv` to manage dependencies. Install them by running:
   ```bash
   pipenv install
   ```

4. **Create a `.env` file** in the `backend/app` directory and add your API key for the weather API:
   ```
   API_KEY=your_openweather_api_key
   ```

5. **Run the Flask app**:
   ```bash
   flask run
   ```

### Frontend (React)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   Run the following command to install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Start the React frontend**:
   ```bash
   npm start
   ```

## Project Structure

```plaintext
Breezely/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── routes.py
│   │   ├── services.py
│   │   └── .env
│   ├── wsgi.py
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── css/
│   │   │   ├── CurrentWeatherCard.js
│   │   │   ├── ForecastCard.js
│   │   │   ├── SingleCityWeather.js
│   │   │   ├── WeatherChart.js
│   │   │   ├── WeatherComparison.js
│   │   │   ├── WeatherInput.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
├── README.md
```

## Technologies Used

- **Frontend**: React, Chart.js
- **Backend**: Flask, Python
- **API**: OpenWeatherMap API for weather data
- **Styling**: CSS with responsiveness
- **Data Fetching**: Axios (in React), requests (in Flask)
- **Virtual Environment**: pipenv for Python, npm for Node

## Future Improvements

1. **User Authentication**: Add login functionality for users to save favorite cities or locations.
2. **Advanced Weather Data**: Include more detailed weather information, such as sunrise/sunset times and UV index.
3. **PWA**: Turn the app into a Progressive Web App (PWA) for offline functionality.
4. **Geolocation**: Automatically detect user's location and show weather accordingly.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
