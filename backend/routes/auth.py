# backend/routes/auth.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from backend.models import db, User
from backend.schemas import user_schema
from backend.utils.auth_utils import hash_password, check_password

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# Register: create new user
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    # check duplicates
    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "User with this email or username already exists"}), 400

    try:
        new_user = User(
            username=username,
            email=email,
            password=hash_password(password),
        )
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(days=7))
        return jsonify({"user": user_schema.dump(new_user), "access_token": access_token}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create user", "detail": str(e)}), 500


# Login: issue JWT token
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({"user": user_schema.dump(user), "access_token": access_token}), 200


# Get current logged-in user's profile
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return user_schema.jsonify(user), 200


# Update current user's profile
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    # Only allow updating certain fields
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if username:
        # ensure uniqueness
        if User.query.filter(User.username == username, User.id != user.id).first():
            return jsonify({"error": "Username already used"}), 400
        user.username = username

    if email:
        if User.query.filter(User.email == email, User.id != user.id).first():
            return jsonify({"error": "Email already used"}), 400
        user.email = email

    if password:
        user.password = hash_password(password)

    try:
        db.session.commit()
        return user_schema.jsonify(user), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not update profile", "detail": str(e)}), 500


# Delete current user account
@auth_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not delete account", "detail": str(e)}), 500
