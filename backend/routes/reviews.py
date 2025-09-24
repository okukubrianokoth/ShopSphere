# backend/routes/reviews.py
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models import Review, Product, User
from backend.schemas import review_schema, reviews_schema

reviews_bp = Blueprint("reviews_bp", __name__)

# Get all reviews
@reviews_bp.route("/", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return reviews_schema.jsonify(reviews)

# Get reviews for a specific product
@reviews_bp.route("/product/<int:product_id>", methods=["GET"])
def get_reviews_by_product(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    return reviews_schema.jsonify(reviews)

# Add a new review
@reviews_bp.route("/", methods=["POST"])
def add_review():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    content = data.get("content")
    rating = data.get("rating", None)

    # Optional: validate existence of user & product
    if not User.query.get(user_id):
        return jsonify({"error": "User not found"}), 404
    if not Product.query.get(product_id):
        return jsonify({"error": "Product not found"}), 404

    review = Review(user_id=user_id, product_id=product_id, content=content, rating=rating)
    db.session.add(review)
    db.session.commit()
    return review_schema.jsonify(review), 201
