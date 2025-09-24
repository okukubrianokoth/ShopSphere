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

# Single instances of extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///shopsphere.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Import models after db.init_app
    from backend import models

    # Register blueprints
    from backend.routes.products import products_bp
    from backend.routes.auth import auth_bp
    from backend.routes.cart import cart_bp
    from backend.routes.orders import orders_bp
    from backend.routes.reviews import reviews_bp
    from backend.routes.likes import likes_bp

    app.register_blueprint(products_bp, url_prefix="/products")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(cart_bp, url_prefix="/cart")
    app.register_blueprint(orders_bp, url_prefix="/orders")
    app.register_blueprint(reviews_bp, url_prefix="/reviews")
    app.register_blueprint(likes_bp, url_prefix="/likes")

    @app.route("/")
    def index():
        return {"message": "ShopSphere API is running"}

    return app
