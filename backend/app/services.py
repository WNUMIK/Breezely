import requests
from .config import Config

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL_OPENCAGE = "https://api.opencagedata.com/geocode/v1/json"

def get_current_weather(city):
    response = requests.get(CURRENT_WEATHER_URL, params={
        'q': city,
        'appid': Config.OPENWEATHER_API_KEY,
        'units': 'metric'
    })
    return response.json() if response.status_code == 200 else None

def get_forecast(city):
    response = requests.get(FORECAST_URL, params={
        'q': city,
        'appid': Config.OPENWEATHER_API_KEY,
        'units': 'metric'
    })
    return response.json() if response.status_code == 200 else None

def get_coordinates(city_name):
    response = requests.get(GEOCODE_URL_OPENCAGE, params={
        'q': city_name,
        'key': Config.OPENCAGE_API_KEY,
        'limit': 1
    })
    if response.status_code == 200 and response.json()['results']:
        coordinates = response.json()['results'][0]['geometry']
        return coordinates
    return None
