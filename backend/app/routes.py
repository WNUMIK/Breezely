from quart import Blueprint, jsonify, request
import aiohttp
from .config import Config
from datetime import datetime

api = Blueprint('api', __name__)

CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL_OPENCAGE = "https://api.opencagedata.com/geocode/v1/json"

async def reverse_geocode(lat, lon):
    """Reverse geocode lat and lon to get the city name using OpenCage API."""
    print(f"Reverse geocoding coordinates: lat={lat}, lon={lon}")
    async with aiohttp.ClientSession() as session:
        async with session.get(GEOCODE_URL_OPENCAGE, params={
            'q': f'{lat},{lon}',
            'key': Config.OPENCAGE_API_KEY,
            'limit': 1
        }) as response:
            if response.status == 200:
                data = await response.json()
                if data['results']:
                    components = data['results'][0]['components']
                    city = components.get('city') or components.get('town') or components.get('village') or components.get('county') or 'Unknown City'
                    print(f"City found from reverse geocoding: {city}")
                    return city
    print(f"Error reverse geocoding: {response.status}, {await response.text()}")
    return None

async def get_city_coordinates(city_name):
    """Fetch coordinates for the city name."""
    print(f"Fetching coordinates for city: {city_name}")
    async with aiohttp.ClientSession() as session:
        async with session.get(GEOCODE_URL_OPENCAGE, params={
            'q': city_name,
            'key': Config.OPENCAGE_API_KEY,
            'limit': 1
        }) as response:
            if response.status == 200:
                data = await response.json()
                if data['results']:
                    geometry = data['results'][0]['geometry']
                    return {'lat': geometry['lat'], 'lon': geometry['lng']}
    print(f"Error fetching coordinates: {response.status}, {await response.text()}")
    return None

def determine_season(lat, lon):
    hemisphere = 'northern' if lat > 0 else 'southern'
    current_month = datetime.utcnow().month

    if -10 <= lat <= 10:  # Equatorial regions
        return "Tropical Season (likely Wet or Dry depending on location)"

    if hemisphere == 'northern':
        if current_month in [3, 4, 5]:
            return 'Spring'
        elif current_month in [6, 7, 8]:
            return 'Summer'
        elif current_month in [9, 10, 11]:
            return 'Autumn'
        else:
            return 'Winter'
    else:
        if current_month in [9, 10, 11]:
            return 'Spring'
        elif current_month in [12, 1, 2]:
            return 'Summer'
        elif current_month in [3, 4, 5]:
            return 'Autumn'
        else:
            return 'Winter'

def get_suggestions(season):
    """Return clothing or activity suggestions based on the season."""
    suggestions_map = {
        "Summer": ["Wear light clothing", "Go swimming", "Drink lots of water"],
        "Winter": ["Wear warm clothing", "Go skiing", "Drink hot beverages"],
        "Spring": ["Wear a light jacket", "Enjoy outdoor picnics", "Watch flowers bloom"],
        "Fall": ["Wear a sweater", "Go hiking", "Enjoy the fall foliage"],
        "Tropical Season (likely Wet or Dry depending on location)": ["Carry an umbrella", "Wear light, breathable clothes"],
    }
    return suggestions_map.get(season, ["No specific suggestions available"])

@api.route('/api/weather', methods=['GET'])
async def weather():
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    print(f"Received request: city={city}, lat={lat}, lon={lon}")

    if lat and lon:
        try:
            lat = float(lat)
            lon = float(lon)
            print(f"Parsed coordinates: lat={lat}, lon={lon}")
            city = await reverse_geocode(lat, lon)
            if not city:
                print(f"Error: Reverse geocoding failed for lat={lat}, lon={lon}")
                return jsonify({'error': 'Failed to reverse geocode location'}), 400
        except (ValueError, TypeError):
            print(f"Invalid lat/lon: lat={lat}, lon={lon}")
            return jsonify({'error': 'Invalid latitude or longitude'}), 400
    else:
        if not city:
            return jsonify({'error': 'City or coordinates are required'}), 400

        coordinates = await get_city_coordinates(city)
        if not coordinates:
            print(f"Error: Unable to fetch coordinates for city: {city}")
            return jsonify({'error': 'Unable to fetch coordinates'}), 404
        lat = coordinates['lat']
        lon = coordinates['lon']
        print(f"Fetched coordinates for {city}: lat={lat}, lon={lon}")

    # Fetch current weather and forecast
    async with aiohttp.ClientSession() as session:
        async with session.get(CURRENT_WEATHER_URL, params={
            'lat': lat,
            'lon': lon,
            'appid': Config.OPENWEATHER_API_KEY,
            'units': 'metric'
        }) as current_weather_response:

            if current_weather_response.status != 200:
                print(f"Error fetching current weather: {current_weather_response.status}, {await current_weather_response.text()}")
                return jsonify({'error': 'Unable to fetch current weather data'}), 500
            current_weather = await current_weather_response.json()

        async with session.get(FORECAST_URL, params={
            'lat': lat,
            'lon': lon,
            'appid': Config.OPENWEATHER_API_KEY,
            'units': 'metric'
        }) as forecast_response:

            if forecast_response.status != 200:
                print(f"Error fetching forecast: {forecast_response.status}, {await forecast_response.text()}")
                return jsonify({'error': 'Unable to fetch forecast data'}), 500
            forecast_data = await forecast_response.json()

    # Summarize forecast
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

    season = determine_season(lat, lon)
    suggestions = get_suggestions(season)

    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_weather['main']['temp'],
            'description': current_weather['weather'][0]['description'],
            'humidity': current_weather['main']['humidity'],
            'wind_speed': current_weather['wind']['speed']
        },
        'lat': lat,
        'lon': lon,
        'forecast': forecast_summary,
        'season': season,
        'suggestions': suggestions
    })
