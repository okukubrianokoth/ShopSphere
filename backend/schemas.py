from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from backend.models import User, Product, Order, OrderItem

# ----------------- User -----------------
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        include_fk = True

    # Explicitly include is_admin so frontend can see it
    is_admin = fields.Boolean()


user_schema = UserSchema()
users_schema = UserSchema(many=True)

# ----------------- Product -----------------
class ProductSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
        include_relationships = True
        include_fk = True

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

# ----------------- OrderItem -----------------
class OrderItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItem
        load_instance = True
        include_relationships = True
        include_fk = True

order_item_schema = OrderItemSchema()
order_items_schema = OrderItemSchema(many=True)

# ----------------- Order -----------------
class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True
        include_relationships = True
        include_fk = True

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
