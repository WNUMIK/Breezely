from quart import Quart
from quart_cors import cors  # Quart version of CORS
from .config import Config
from .routes import api

def create_app():
    app = Quart(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS for all routes (using quart_cors)
    cors(app)

    # Register API routes
    app.register_blueprint(api)

    return app