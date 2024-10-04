from flask import Blueprint, jsonify, request
import requests
from .config import Config
from datetime import datetime

api = Blueprint('api', __name__)

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL_OPENCAGE = "https://api.opencagedata.com/geocode/v1/json"

def get_city_coordinates(city_name):
    print(f"Fetching coordinates for city: {city_name}")  # Log the city name
    response = requests.get(GEOCODE_URL_OPENCAGE, params={
        'q': city_name,
        'key': Config.OPENCAGE_API_KEY,
        'limit': 1
    })
    if response.status_code == 200 and response.json()['results']:
        geometry = response.json()['results'][0]['geometry']
        return {'lat': geometry['lat'], 'lon': geometry['lng']}
    print(f"Error fetching coordinates: {response.status_code}, {response.text}")  # Log error details
    return None


def determine_season(lat, lon):
    """
    Determine the current season based on the latitude and current month.
    Northern Hemisphere:
        Spring: March 1 – May 31
        Summer: June 1 – August 31
        Autumn: September 1 – November 30
        Winter: December 1 – February 28/29
    Southern Hemisphere:
        Spring: September 1 – November 30
        Summer: December 1 – February 28/29
        Autumn: March 1 – May 31
        Winter: June 1 – August 31
    """
    hemisphere = 'northern' if lat >= 0 else 'southern'
    current_month = datetime.utcnow().month

    if hemisphere == 'northern':
        if 3 <= current_month <= 5:
            return 'Spring'
        elif 6 <= current_month <= 8:
            return 'Summer'
        elif 9 <= current_month <= 11:
            return 'Autumn'
        else:
            return 'Winter'
    else:
        if 9 <= current_month <= 11:
            return 'Spring'
        elif 12 <= current_month or current_month <= 2:
            return 'Summer'
        elif 3 <= current_month <= 5:
            return 'Autumn'
        else:
            return 'Winter'

def get_suggestions(season):
    """
    Provide suggestions based on the current season.
    """
    suggestions = {
        'Spring': ["Carry a light jacket", "Enjoy the blooming flowers"],
        'Summer': ["Stay hydrated", "Wear sunscreen"],
        'Autumn': ["Wear layers", "Prepare for cooler evenings"],
        'Winter': ["Wear warm clothing", "Keep an umbrella handy"]
    }
    return suggestions.get(season, ["Have a great day!"])

@api.route('/api/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Get coordinates using OpenCage
    coordinates = get_city_coordinates(city)
    if not coordinates:
        return jsonify({'error': 'Unable to fetch coordinates'}), 404

    # Fetch current weather
    current_weather_response = requests.get(CURRENT_WEATHER_URL, params={
        'q': city,
        'appid': Config.OPENWEATHER_API_KEY,
        'units': 'metric'
    })
    if current_weather_response.status_code != 200:
        return jsonify({'error': 'Unable to fetch current weather data'}), 500
    current_weather = current_weather_response.json()

    # Fetch forecast
    forecast_response = requests.get(FORECAST_URL, params={
        'q': city,
        'appid': Config.OPENWEATHER_API_KEY,
        'units': 'metric'
    })
    if forecast_response.status_code != 200:
        return jsonify({'error': 'Unable to fetch forecast data'}), 500
    forecast_data = forecast_response.json()

    forecast_summary = []
    seen_dates = set()
    for forecast in forecast_data['list']:
        date = forecast['dt_txt'].split(' ')[0]
        if date not in seen_dates:
            seen_dates.add(date)
            forecast_summary.append({
                'date': date,
                'temperature': forecast['main']['temp'],
                'description': forecast['weather'][0]['description'],
                'humidity': forecast['main']['humidity'],
                'wind_speed': forecast['wind']['speed'],
                'precipitation': forecast.get('rain', {}).get('3h', 0) + forecast.get('snow', {}).get('3h', 0)
            })

    season = "Summer"
    suggestions = ["Wear light clothing", "Stay hydrated"]

    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_weather['main']['temp'],
            'description': current_weather['weather'][0]['description'],
            'humidity': current_weather['main']['humidity'],
            'wind_speed': current_weather['wind']['speed']
        },
        'lat': coordinates['lat'],  # Ensure coordinates are added here
        'lon': coordinates['lon'],  # Ensure coordinates are added here
        'forecast': forecast_summary,
        'season': season,
        'suggestions': suggestions
    })
