from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('API_KEY')
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    response = requests.get(BASE_URL, params={
        'q': city,
        'appid': API_KEY,
        'units': 'metric'
    })

    if response.status_code == 200:
        data = response.json()
        weather = {
            'city': city,
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed']
        }
        return jsonify(weather)
    else:
        return jsonify({'error': 'City not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
