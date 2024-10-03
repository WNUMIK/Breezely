from flask import Blueprint, jsonify, request
from .services import get_current_weather, get_forecast

# Create a Blueprint for API routes
api = Blueprint('api', __name__)

@api.route('/api/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Fetch current weather
    current_weather = get_current_weather(city)
    if not current_weather:
        return jsonify({'error': 'City not found'}), 404

    # Fetch forecast data
    forecast_data = get_forecast(city)
    if not forecast_data:
        return jsonify({'error': 'Unable to fetch forecast data'}), 500

    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_weather['main']['temp'],
            'description': current_weather['weather'][0]['description'],
            'humidity': current_weather['main']['humidity'],
            'wind_speed': current_weather['wind']['speed']
        },
        'forecast': forecast_data  # Modify the format as needed
    })
