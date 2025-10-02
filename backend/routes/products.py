from flask import Blueprint, request, jsonify
from backend.models import db, Product
from backend.schemas import product_schema, products_schema

products_bp = Blueprint("products", __name__)

# -------------------------
# GET all products (newest first)
# -------------------------
@products_bp.route("/", methods=["GET"])
def get_products():
    # Order by id descending so newest products appear first
    products = Product.query.order_by(Product.id.desc()).all()
    return jsonify(products_schema.dump(products)), 200

# -------------------------
# GET single product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product_schema.dump(product)), 200

# -------------------------
# CREATE product
# -------------------------
@products_bp.route("/", methods=["POST"])
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        stock=data.get("stock"),
        image_url=data.get("image_url"),
        category=data.get("category"),
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(product_schema.dump(new_product)), 201

# -------------------------
# UPDATE product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["PATCH"])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    for key in ["name", "description", "price", "stock", "image_url", "category"]:
        if key in data:
            setattr(product, key, data[key])
    db.session.commit()
    return jsonify(product_schema.dump(product)), 200

# -------------------------
# DELETE product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": f"Product {product_id} deleted"}), 200
