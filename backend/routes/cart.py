from flask import Blueprint, jsonify, request
from backend.models import CartItem, Product
from backend.schemas import cart_item_schema, cart_items_schema
from backend.app import db

cart_bp = Blueprint("cart", __name__)

# GET all items in cart
@cart_bp.route("/", methods=["GET"])
def get_cart_items():
    cart_items = CartItem.query.all()
    return cart_items_schema.jsonify(cart_items), 200

# ADD item to cart
@cart_bp.route("/", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    cart_item = CartItem(
        user_id=data.get("user_id"),
        product_id=data.get("product_id"),
        quantity=data.get("quantity", 1)
    )
    db.session.add(cart_item)
    db.session.commit()
    return cart_item_schema.jsonify(cart_item), 201

# UPDATE cart item quantity
@cart_bp.route("/<int:item_id>", methods=["PUT"])
def update_cart_item(item_id):
    data = request.get_json()
    item = CartItem.query.get_or_404(item_id)
    item.quantity = data.get("quantity", item.quantity)
    db.session.commit()
    return cart_item_schema.jsonify(item), 200

# DELETE cart item
@cart_bp.route("/<int:item_id>", methods=["DELETE"])
def delete_cart_item(item_id):
    item = CartItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Cart item deleted"}), 200
