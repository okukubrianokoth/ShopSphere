# backend/routes/products.py
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from backend.app import db

products_bp = Blueprint("products", __name__)

# GET all products
@products_bp.route("/", methods=["GET"])
def get_products():
    from backend.models import Product
    from backend.schemas import products_schema

    try:
        products = Product.query.all()
        result = products_schema.dump(products)  # serialize manually
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch products", "details": str(e)}), 500

# GET single product by id
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    from backend.models import Product
    from backend.schemas import product_schema

    try:
        product = Product.query.get_or_404(product_id)
        result = product_schema.dump(product)  # serialize manually
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch product", "details": str(e)}), 500

# POST a new product
@products_bp.route("/", methods=["POST"])
def create_product():
    from backend.models import Product
    from backend.schemas import product_schema

    data = request.get_json()

    # Validate input
    try:
        validated_data = product_schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    new_product = Product(
        name=validated_data["name"],
        description=validated_data.get("description"),
        price=validated_data["price"],
        stock=validated_data.get("stock", 0),
        image_url=validated_data.get("image_url"),
        category=validated_data.get("category")
    )

    try:
        db.session.add(new_product)
        db.session.commit()
        result = product_schema.dump(new_product)
        return jsonify(result), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create product", "details": str(e)}), 500

# PUT update product
@products_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    from backend.models import Product
    from backend.schemas import product_schema

    data = request.get_json()
    product = Product.query.get_or_404(product_id)

    try:
        validated_data = product_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    product.name = validated_data.get("name", product.name)
    product.description = validated_data.get("description", product.description)
    product.price = validated_data.get("price", product.price)
    product.stock = validated_data.get("stock", product.stock)
    product.image_url = validated_data.get("image_url", product.image_url)
    product.category = validated_data.get("category", product.category)

    try:
        db.session.commit()
        result = product_schema.dump(product)
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update product", "details": str(e)}), 500

# DELETE product
@products_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    from backend.models import Product

    product = Product.query.get_or_404(product_id)

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete product", "details": str(e)}), 500
