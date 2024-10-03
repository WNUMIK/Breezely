import os
from dotenv import load_dotenv

# Load environment variables from .env
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '../.env'))  # Go up one level to access .env

class Config:
    API_KEY = os.getenv('API_KEY')  # Fetch API key from .env
