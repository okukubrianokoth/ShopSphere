# backend/routes/orders.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Order, OrderItem, Product
from schemas import order_schema, orders_schema
from sqlalchemy.orm import joinedload

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    limit = request.args.get("limit", type=int)
    
    
    query = Order.query.options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter_by(user_id=user_id, status="completed").order_by(Order.created_at.desc())
    
    if limit:
        query = query.limit(limit)
    orders = query.all()
    return jsonify(orders_schema.dump(orders)), 200


@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    return jsonify(order_schema.dump(order)), 200  


@orders_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    items = data.get("items", [])

    if not items:
        return jsonify({"error": "No items to create order"}), 400

    order = Order(user_id=user_id, status=data.get("status", "pending"))
    db.session.add(order)
    db.session.commit()

    total_price = 0
    for i in items:
        product = Product.query.get_or_404(i["product_id"])
        quantity = i.get("quantity", 1)
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )
        db.session.add(order_item)
        total_price += product.price * quantity

    order.total_price = total_price
    db.session.commit()
    
    
    created_order = Order.query.options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).get(order.id)
    
    return jsonify(order_schema.dump(created_order)), 201  

@orders_bp.route("/<int:order_id>", methods=["PUT"])
@jwt_required()
def update_order(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    order.status = data.get("status", order.status)
    db.session.commit()
    return jsonify(order_schema.dump(order)), 200  

@orders_bp.route("/<int:order_id>", methods=["DELETE"])
@jwt_required()
def delete_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200