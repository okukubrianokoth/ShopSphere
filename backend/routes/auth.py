from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from backend.models import db, User
from backend.schemas import user_schema
from backend.utils.auth_utils import hash_password, check_password

auth_bp = Blueprint("auth", __name__)

# Register new user
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "User with this email or username already exists"}), 400

    try:
        new_user = User(
            username=username,
            email=email,
            password=hash_password(password),
            is_admin=data.get("is_admin", False)  # default to regular user
        )
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(days=7))
        return jsonify({
            "user": {
                **user_schema.dump(new_user),
                "is_admin": new_user.is_admin
            },
            "access_token": access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create user", "detail": str(e)}), 500


# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    identifier = data.get("emailOrUsername")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "emailOrUsername and password required"}), 400

    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    if not user or not check_password(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({
        "user": {
            **user_schema.dump(user),
            "is_admin": user.is_admin
        },
        "access_token": access_token
    }), 200


# Current user profile
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        **user_schema.dump(user),
        "is_admin": user.is_admin
    }), 200


# Update current user profile
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if username and User.query.filter(User.username == username, User.id != user.id).first():
        return jsonify({"error": "Username already used"}), 400
    if username: user.username = username

    if email and User.query.filter(User.email == email, User.id != user.id).first():
        return jsonify({"error": "Email already used"}), 400
    if email: user.email = email

    if password: user.password = hash_password(password)

    try:
        db.session.commit()
        return jsonify({
            **user_schema.dump(user),
            "is_admin": user.is_admin
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not update profile", "detail": str(e)}), 500


# Delete current user
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
