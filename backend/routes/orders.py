from flask import Blueprint, jsonify, request
from backend.models import Order, OrderItem, Product
from backend.schemas import order_schema, orders_schema, order_item_schema, order_items_schema
from backend.app import db

orders_bp = Blueprint("orders", __name__)

# GET all orders
@orders_bp.route("/", methods=["GET"])
def get_orders():
    orders = Order.query.all()
    return orders_schema.jsonify(orders), 200

# GET single order
@orders_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return order_schema.jsonify(order), 200

# CREATE order
@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.get_json()
    order = Order(user_id=data.get("user_id"), status=data.get("status", "pending"))
    db.session.add(order)
    db.session.commit()

    items = data.get("items", [])
    for i in items:
        product = Product.query.get_or_404(i["product_id"])
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=i.get("quantity", 1),
            price=product.price
        )
        db.session.add(order_item)
        order.total_price += product.price * order_item.quantity

    db.session.commit()
    return order_schema.jsonify(order), 201

# UPDATE order status
@orders_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    data = request.get_json()
    order = Order.query.get_or_404(order_id)
    order.status = data.get("status", order.status)
    db.session.commit()
    return order_schema.jsonify(order), 200

# DELETE order
@orders_bp.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200
