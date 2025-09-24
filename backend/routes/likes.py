# backend/routes/likes.py
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models import Like, Product, User
from backend.schemas import like_schema, likes_schema

likes_bp = Blueprint("likes_bp", __name__)

# Get all likes
@likes_bp.route("/", methods=["GET"])
def get_likes():
    likes = Like.query.all()
    return likes_schema.jsonify(likes)

# Get likes for a specific product
@likes_bp.route("/product/<int:product_id>", methods=["GET"])
def get_likes_by_product(product_id):
    likes = Like.query.filter_by(product_id=product_id).all()
    return likes_schema.jsonify(likes)

# Add a like
@likes_bp.route("/", methods=["POST"])
def add_like():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")

    # Optional: validate existence of user & product
    if not User.query.get(user_id):
        return jsonify({"error": "User not found"}), 404
    if not Product.query.get(product_id):
        return jsonify({"error": "Product not found"}), 404

    # Prevent duplicate likes
    existing_like = Like.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_like:
        return like_schema.jsonify(existing_like), 200

    like = Like(user_id=user_id, product_id=product_id)
    db.session.add(like)
    db.session.commit()
    return like_schema.jsonify(like), 201
