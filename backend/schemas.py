# backend/schemas.py
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from backend.models import User, Product, CartItem, Order, OrderItem, Review, Like

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        include_fk = True

class ProductSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
        include_relationships = True
        include_fk = True

class CartItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CartItem
        load_instance = True
        include_relationships = True
        include_fk = True

class OrderItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItem
        load_instance = True
        include_relationships = True
        include_fk = True

class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True
        include_relationships = True
        include_fk = True

class ReviewSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Review
        load_instance = True
        include_relationships = True
        include_fk = True

class LikeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Like
        load_instance = True
        include_relationships = True
        include_fk = True


# exported schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

cart_item_schema = CartItemSchema()
cart_items_schema = CartItemSchema(many=True)

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

order_item_schema = OrderItemSchema()
order_items_schema = OrderItemSchema(many=True)

review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

like_schema = LikeSchema()
likes_schema = LikeSchema(many=True)
