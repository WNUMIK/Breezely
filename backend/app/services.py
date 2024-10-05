import aiohttp
from aiocache import cached
from .config import Config

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL_OPENCAGE = "https://api.opencagedata.com/geocode/v1/json"

# Cache the results of this function for 30 minutes (1800 seconds)
@cached(ttl=1800, cache="aiocache.SimpleMemoryCache")
async def get_current_weather(lat, lon):
    async with aiohttp.ClientSession() as session:
        async with session.get(CURRENT_WEATHER_URL, params={
            'lat': lat,
            'lon': lon,
            'appid': Config.OPENWEATHER_API_KEY,
            'units': 'metric'
        }) as response:
            return await response.json() if response.status == 200 else None

# Cache the forecast data for 30 minutes
@cached(ttl=1800, cache="aiocache.SimpleMemoryCache")
async def get_forecast(lat, lon):
    async with aiohttp.ClientSession() as session:
        async with session.get(FORECAST_URL, params={
            'lat': lat,
            'lon': lon,
            'appid': Config.OPENWEATHER_API_KEY,
            'units': 'metric'
        }) as response:
            return await response.json() if response.status == 200 else None

@cached(ttl=1800, cache="aiocache.SimpleMemoryCache")
async def get_coordinates(city_name):
    async with aiohttp.ClientSession() as session:
        async with session.get(GEOCODE_URL_OPENCAGE, params={
            'q': city_name,
            'key': Config.OPENCAGE_API_KEY,
            'limit': 1
        }) as response:
            data = await response.json()
            if response.status == 200 and data['results']:
                return data['results'][0]['geometry']
    return None