from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes import api

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS for all routes
    CORS(app)

    # Register API routes
    app.register_blueprint(api)

    return app
