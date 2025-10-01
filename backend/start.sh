#!/bin/bash

# Run database migrations
flask db upgrade

# Start Gunicorn server
gunicorn "app:create_app()" --bind 0.0.0.0:$PORT