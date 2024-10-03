from ..app import create_app  # Adjust according to your app structure
import unittest

class TestWeatherAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_get_weather(self):
        response = self.client.get('/api/weather?city=Warsaw')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'current_weather', response.data)

    def test_invalid_city(self):
        response = self.client.get('/api/weather?city=InvalidCity')
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'City not found', response.data)

if __name__ == '__main__':
    unittest.main()
