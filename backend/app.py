# backend/app.py
import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

load_dotenv() 

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///shopsphere.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    from backend import models

    from backend.routes.products import products_bp
    from backend.routes.auth import auth_bp
    from backend.routes.orders import orders_bp

    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(auth_bp, url_prefix="/api/users") 
    app.register_blueprint(orders_bp, url_prefix="/api/orders")


    @app.route("/")
    def index():
        return {"message": "ShopSphere API is running"}

    return app
