import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# API key and URLs
API_KEY = os.getenv('API_KEY')
CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"


@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')

    # Log the incoming city parameter
    print(f"Received request for city: {city}")

    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Fetch current weather
    current_weather_response = requests.get(CURRENT_WEATHER_URL, params={
        'q': city,
        'appid': API_KEY,
        'units': 'metric'
    })

    if current_weather_response.status_code != 200:
        return jsonify({'error': 'City not found'}), 404

    current_data = current_weather_response.json()

    # Fetch the 5-day forecast using city name
    forecast_response = requests.get(FORECAST_URL, params={
        'q': city,
        'appid': API_KEY,
        'units': 'metric'
    })

    if forecast_response.status_code != 200:
        return jsonify({'error': 'Unable to fetch forecast data'}), 500

    forecast_data = forecast_response.json()

    # Process the 5-day forecast by grouping the data into days
    daily_forecast = {}
    for forecast in forecast_data['list']:
        date = datetime.utcfromtimestamp(forecast['dt']).strftime('%Y-%m-%d')  # Extract the date (YYYY-MM-DD)
        if date not in daily_forecast:
            daily_forecast[date] = {
                'temperature': [],
                'description': forecast['weather'][0]['description'],
                'humidity': [],
                'wind_speed': []
            }

        # Append data for the day
        daily_forecast[date]['temperature'].append(forecast['main']['temp'])
        daily_forecast[date]['humidity'].append(forecast['main']['humidity'])
        daily_forecast[date]['wind_speed'].append(forecast['wind']['speed'])

    # Summarize the daily data by averaging the values
    forecast_summary = []
    for date, data in daily_forecast.items():
        forecast_summary.append({
            'date': date,
            'temperature': sum(data['temperature']) / len(data['temperature']),
            'description': data['description'],
            'humidity': sum(data['humidity']) / len(data['humidity']),
            'wind_speed': sum(data['wind_speed']) / len(data['wind_speed'])
        })

    # Return current weather and 5-day forecast
    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_data['main']['temp'],
            'description': current_data['weather'][0]['description'],
            'humidity': current_data['main']['humidity'],
            'wind_speed': current_data['wind']['speed']
        },
        'forecast': forecast_summary
    })


if __name__ == '__main__':
    app.run(debug=True)
