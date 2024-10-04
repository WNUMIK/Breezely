import requests
from .config import Config

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL_OPENWEATHER = "http://api.openweathermap.org/geo/1.0/reverse"
GEOCODE_URL_OPENCAGE = "https://api.opencagedata.com/geocode/v1/json"  # New API URL

def get_current_weather(city):
    response = requests.get(CURRENT_WEATHER_URL, params={
        'q': city,
        'appid': Config.API_KEY,
        'units': 'metric'
    })
    return response.json() if response.status_code == 200 else None

def get_forecast(city):
    response = requests.get(FORECAST_URL, params={
        'q': city,
        'appid': Config.API_KEY,
        'units': 'metric'
    })
    return response.json() if response.status_code == 200 else None

# Function to get city coordinates using OpenCage
def get_city_from_opencage(city_name):
    response = requests.get(GEOCODE_URL_OPENCAGE, params={
        'q': city_name,
        'key': Config.OPENCAGE_API_KEY,  # Use the new API key
        'limit': 1
    })
    if response.status_code == 200 and response.json()['results']:
        coordinates = response.json()['results'][0]['geometry']
        return coordinates
    return None

# Modify this to fallback to OpenCage when OpenWeather fails
def get_city_from_geo(lat, lon):
    # Use OpenWeather for reverse geocoding first
    response = requests.get(GEOCODE_URL_OPENWEATHER, params={
        'lat': lat,
        'lon': lon,
        'appid': Config.API_KEY,
        'limit': 1
    })
    if response.status_code == 200 and response.json():
        return response.json()[0].get('name')
    return None  # Fallback to OpenCage if OpenWeather fails
