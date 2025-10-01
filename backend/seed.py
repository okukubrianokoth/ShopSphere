# backend/seed.py
import random
from faker import Faker
from backend.app import create_app, db
from backend.models import Product, User
from backend.utils.auth_utils import hash_password

fake = Faker()


CATEGORIES = ["Electronics", "Fashion", "Home Appliances", "Accessories"]
ELECTRONICS = ["Phone", "Laptop", "Headphones", "Tablet", "Camera", "Smartwatch"]
FASHION = ["T-Shirt", "Jeans", "Sneakers", "Jacket", "Dress", "Cap"]
HOME_APPLIANCES = ["Blender", "Microwave", "Vacuum Cleaner", "Toaster", "Coffee Maker", "Air Fryer"]
ACCESSORIES = ["Backpack", "Wallet", "Belt", "Sunglasses", "Watch", "Necklace"]
DEMO_USERS = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob", "email": "bob@example.com", "password": "password123"},
    {"username": "charlie", "email": "charlie@example.com", "password": "password123"},
]

def generate_product(category):
    if category == "Electronics":
        name = f"{fake.company()} {random.choice(ELECTRONICS)}"
        price = round(random.uniform(100, 2000), 2)
    elif category == "Fashion":
        name = f"{random.choice(FASHION)} by {fake.first_name()}"
        price = round(random.uniform(10, 150), 2)
    elif category == "Home Appliances":
        name = f"{random.choice(HOME_APPLIANCES)} {fake.company()}"
        price = round(random.uniform(50, 500), 2)
    else: 
        name = f"{random.choice(ACCESSORIES)} {fake.word()}"
        price = round(random.uniform(5, 80), 2)

    description = fake.sentence(nb_words=12)
    image_seed = name.replace(" ", "_") + str(random.randint(1, 10000))
    image_url = f"https://picsum.photos/seed/{image_seed}/400/300"

    return Product(
        name=name,
        description=description,
        price=price,
        category=category,
        image_url=image_url,
        stock=random.randint(1, 100),
    )

def seed_products(n=100):
    app = create_app()
    with app.app_context():
      
        existing_names = {p.name for p in Product.query.all()}
        products = []
        while len(products) < n:
            category = random.choice(CATEGORIES)
            product = generate_product(category)
            if product.name not in existing_names:
                products.append(product)
                existing_names.add(product.name)
        db.session.bulk_save_objects(products)
        db.session.commit()
        print(f"✅ Added {len(products)} products successfully!")

        
        for user_data in DEMO_USERS:
            existing_user = User.query.filter(
                (User.email == user_data["email"]) | (User.username == user_data["username"])
            ).first()
            if existing_user:
                db.session.delete(existing_user)
        db.session.commit()
        for user_data in DEMO_USERS:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password=hash_password(user_data["password"])
            )
            db.session.add(user)
        db.session.commit()
        print(" Demo users seeded successfully!")

if __name__ == "__main__":
    seed_products(100)
