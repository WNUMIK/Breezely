import requests
from .config import Config

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/reverse"

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

def get_city_from_geo(lat, lon):
    response = requests.get(GEOCODE_URL, params={
        'lat': lat,
        'lon': lon,
        'appid': Config.API_KEY,
        'limit': 1
    })
    if response.status_code == 200 and response.json():
        return response.json()[0].get('name')
    return None
