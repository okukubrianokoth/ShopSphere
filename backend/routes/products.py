from flask import Blueprint, jsonify
from backend.models import Product
from backend.schemas import products_schema, product_schema

products_bp = Blueprint("products", __name__)

# GET all products
@products_bp.route("/", methods=["GET"])
def get_products():
    try:
        products = Product.query.all()
        return jsonify(products_schema.dump(products)), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch products", "details": str(e)}), 500

# GET single product by id
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product_schema.dump(product)), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch product", "details": str(e)}), 500
