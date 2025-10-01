from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from backend.models import User, Product, Order, OrderItem

# Product Schema
class ProductSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
class OrderItemSchema(SQLAlchemyAutoSchema):
    product = fields.Nested(ProductSchema)  
    
    class Meta:
        model = OrderItem
        load_instance = True
class OrderSchema(SQLAlchemyAutoSchema):
    items = fields.Nested(OrderItemSchema, many=True)
    
    class Meta:
        model = Order
        load_instance = True
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password',) 


user_schema = UserSchema()
users_schema = UserSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
order_item_schema = OrderItemSchema()
order_items_schema = OrderItemSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)