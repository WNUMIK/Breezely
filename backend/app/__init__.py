from flask import Flask
from .config import Config
from .routes import api


def create_app():
    """Create and configure the Flask app."""
    app = Flask(__name__)

    # Load the configuration (API key, etc.)
    app.config.from_object(Config)

    # Register the routes defined in routes.py
    app.register_blueprint(api)

    return app
