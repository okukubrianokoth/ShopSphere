import random
from faker import Faker
from backend.app import create_app, db
from backend.models import Product

fake = Faker()

CATEGORIES = ["Electronics", "Fashion", "Food", "Accessories"]
ELECTRONICS = ["Phone", "Laptop", "Headphones", "Tablet", "Camera", "Smartwatch"]
FASHION = ["T-Shirt", "Jeans", "Sneakers", "Jacket", "Dress", "Cap"]
FOOD = ["Pizza", "Burger", "Pasta", "Chocolate", "Juice", "Coffee"]
ACCESSORIES = ["Backpack", "Wallet", "Belt", "Sunglasses", "Watch", "Necklace"]

def generate_product(category):
    if category == "Electronics":
        name = f"{fake.company()} {random.choice(ELECTRONICS)}"
        price = round(random.uniform(100, 2000), 2)
    elif category == "Fashion":
        name = f"{random.choice(FASHION)} by {fake.first_name()}"
        price = round(random.uniform(10, 150), 2)
    elif category == "Food":
        name = f"{random.choice(FOOD)} {fake.color_name()}"
        price = round(random.uniform(2, 20), 2)
    else:
        name = f"{random.choice(ACCESSORIES)} {fake.word()}"
        price = round(random.uniform(5, 80), 2)

    description = fake.sentence(nb_words=12)
    image_url = f"https://picsum.photos/seed/{fake.uuid4()}/400/300"

    return Product(
        name=name,
        description=description,
        price=price,
        category=category,
        image_url=image_url,
        stock=random.randint(0, 100),
    )

def seed_products(n=200):
    app = create_app()
    with app.app_context():
        print("🗑️ Clearing old products...")
        db.session.query(Product).delete()
        db.session.commit()

        print(f"🌱 Seeding {n} products...")
        products = [generate_product(random.choice(CATEGORIES)) for _ in range(n)]
        db.session.bulk_save_objects(products)
        db.session.commit()
        print("✅ Done seeding products!")

if __name__ == "__main__":
    seed_products(200)
