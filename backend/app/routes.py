from flask import Blueprint, jsonify, request
from .services import get_current_weather, get_forecast, get_city_from_geo, get_city_from_opencage

api = Blueprint('api', __name__)

@api.route('/api/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    current_weather = get_current_weather(city)
    if not current_weather:
        return jsonify({'error': 'City not found'}), 404

    forecast_data = get_forecast(city)
    if not forecast_data or 'list' not in forecast_data:
        return jsonify({'error': 'Unable to fetch forecast data'}), 500

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

    # Get coordinates from OpenCage if OpenWeather fails
    city_coords = get_city_from_opencage(city)
    if not city_coords:
        return jsonify({'error': 'Unable to fetch coordinates'}), 404

    return jsonify({
        'city': city,
        'current_weather': {
            'temperature': current_weather['main']['temp'],
            'description': current_weather['weather'][0]['description'],
            'humidity': current_weather['main']['humidity'],
            'wind_speed': current_weather['wind']['speed']
        },
        'lat': city_coords['lat'],
        'lon': city_coords['lng'],
        'forecast': forecast_summary
    })
