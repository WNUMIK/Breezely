import requests
from .config import Config
import datetime

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


def get_season(lat, lon):
    month = datetime.now().month
    hemisphere = "north" if float(lat) >= 0 else "south"

    if hemisphere == "north":
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "fall"
    else:
        if month in [12, 1, 2]:
            return "summer"
        elif month in [3, 4, 5]:
            return "fall"
        elif month in [6, 7, 8]:
            return "winter"
        else:
            return "spring"

def get_suggestions(temperature, weather_condition):
    suggestions = []
    if temperature < 10:
        suggestions.append("Wear a warm coat")
    elif 10 <= temperature < 20:
        suggestions.append("Wear a jacket or sweater")
    else:
        suggestions.append("Wear light clothing")

    if "rain" in weather_condition:
        suggestions.append("Carry an umbrella")
    elif "snow" in weather_condition:
        suggestions.append("Dress warmly and wear snow boots")

    return suggestions
