import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '../.env'))

class Config:
    OPENWEATHER_API_KEY = os.getenv('API_KEY')
    OPENCAGE_API_KEY=os.getenv('OPENCAGE_API_KEY')