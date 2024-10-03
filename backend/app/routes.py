from flask import Blueprint, jsonify, request
from .services import get_current_weather, get_forecast

api = Blueprint('api', __name__)

@api.route('/api/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Get current weather
    current_weather = get_current_weather(city)
    if not current_weather:
        return jsonify({'error': 'City not found'}), 404

    # Get forecast data
    forecast_data = get_forecast(city)
    if not forecast_data or 'list' not in forecast_data:
        return jsonify({'error': 'Unable to fetch forecast data'}), 500

    # Process the 5-day forecast, ensuring an array is always returned
    forecast_summary = []
    seen_dates = set()

    for forecast in forecast_data['list']:
        date = forecast['dt_txt'].split(' ')[0]  # Get the date only (YYYY-MM-DD)

        if date not in seen_dates:
            seen_dates.add(date)
            forecast_summary.append({
                'date': date,
                'temperature': forecast['main']['temp'],
                'description': forecast['weather'][0]['description'],
                'humidity': forecast['main']['humidity'],
                'wind_speed': forecast['wind']['speed'],
                'precipitation': forecast.get('rain', {}).get('3h', 0) + forecast.get('snow', {}).get('3h', 0)  # Sum rain and snow if present, default to 0
            })

    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_weather['main']['temp'],
            'description': current_weather['weather'][0]['description'],
            'humidity': current_weather['main']['humidity'],
            'wind_speed': current_weather['wind']['speed']
        },
        'forecast': forecast_summary  # Always return an array
    })

