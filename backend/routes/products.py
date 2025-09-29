from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Product, User
from backend.schemas import product_schema, products_schema

products_bp = Blueprint("products", __name__)

# =========================
# GET all products
# =========================
@products_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify(products_schema.dump(products)), 200


# =========================
# GET single product by id
# =========================
@products_bp.route("/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product_schema.dump(product)), 200


# =========================
# POST new product (admin only)
# =========================
@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json() or {}
    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    category = data.get("category")
    image_url = data.get("image_url")
    stock = data.get("stock", 0)

    if not name or not price:
        return jsonify({"error": "Name and price are required"}), 400

    try:
        new_product = Product(
            name=name,
            price=price,
            description=description,
            category=category,
            image_url=image_url,
            stock=stock
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(product_schema.dump(new_product)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create product", "detail": str(e)}), 500


# =========================
# PUT update product (admin only)
# =========================
@products_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Admins only"}), 403

    product = Product.query.get_or_404(id)
    data = request.get_json() or {}

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.description = data.get("description", product.description)
    product.category = data.get("category", product.category)
    product.image_url = data.get("image_url", product.image_url)
    product.stock = data.get("stock", product.stock)

    try:
        db.session.commit()
        return jsonify(product_schema.dump(product)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update product", "detail": str(e)}), 500


# =========================
# DELETE product (admin only)
# =========================
@products_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Admins only"}), 403

    product = Product.query.get_or_404(id)

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete product", "detail": str(e)}), 500
