#!/bin/bash
export QUART_APP=backend/wsgi.py  # Specify the app location
quart run --reload
