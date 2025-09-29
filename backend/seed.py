# backend/seed.py
from backend.app import create_app, db
from backend.models import Product, User
from backend.utils.auth_utils import hash_password

# Demo users
DEMO_USERS = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob", "email": "bob@example.com", "password": "password123"},
    {"username": "charlie", "email": "charlie@example.com", "password": "password123"},
]

# 100 unique persistent products with image URLs
PRODUCTS = [
    # Electronics
    {"name": "Smartphone X1", "description": "High-end smartphone with OLED display", "price": 999.99, "category": "Electronics", "stock": 50, "image_url": "https://i.pinimg.com/736x/f4/5c/b0/f45cb00318293450db4a73d33af6d820.jpg"},
    {"name": "Gaming Laptop Pro", "description": "Laptop with RTX graphics and high RAM", "price": 1999.99, "category": "Electronics", "stock": 30, "image_url": "https://i.pinimg.com/1200x/63/26/50/632650d4a548158dfc3120f93ca95ce1.jpg"},
    {"name": "Smartwatch Series 5", "description": "Fitness smartwatch with heart rate monitor", "price": 200.00, "category": "Electronics", "stock": 30, "image_url": "https://i.pinimg.com/1200x/d8/45/93/d84593f11394d5f4b0b6c6513f393a40.jpg"},
    {"name": "Digital Camera Pro", "description": "DSLR camera with lens kit", "price": 1200.00, "category": "Electronics", "stock": 15, "image_url": "https://i.pinimg.com/736x/29/73/07/2973076802468024.jpg"},
    {"name": "Smart Home Hub", "description": "Control all your smart devices", "price": 200.00, "category": "Electronics", "stock": 20, "image_url": "https://i.pinimg.com/736x/30/74/08/3074087913579135.jpg"},
    {"name": "4K Monitor", "description": "27-inch ultra HD monitor", "price": 350.00, "category": "Electronics", "stock": 25, "image_url": "https://i.pinimg.com/736x/31/75/09/3175098023579135.jpg"},
    {"name": "Gaming Mouse", "description": "High precision RGB gaming mouse", "price": 50.00, "category": "Electronics", "stock": 40, "image_url": "https://i.pinimg.com/736x/32/76/10/3276109134680246.jpg"},
    {"name": "Mechanical Keyboard", "description": "RGB backlit mechanical keyboard", "price": 100.00, "category": "Electronics", "stock": 30, "image_url": "https://i.pinimg.com/736x/33/77/11/3377110245791357.jpg"},
    {"name": "Smart Home Camera", "description": "Indoor security camera with motion detection", "price": 80.00, "category": "Electronics", "stock": 40, "image_url": "https://i.pinimg.com/736x/59/03/37/5903376802468024.jpg"},
    {"name": "Wireless Charger", "description": "Fast wireless charging pad", "price": 25.00, "category": "Electronics", "stock": 60, "image_url": "https://i.pinimg.com/736x/60/04/38/6004387913579135.jpg"},
    {"name": "VR Headset", "description": "Virtual reality headset with controllers", "price": 300.00, "category": "Electronics", "stock": 15, "image_url": "https://i.pinimg.com/736x/61/05/39/6105398024680246.jpg"},
    {"name": "Portable SSD 1TB", "description": "Fast external SSD drive", "price": 150.00, "category": "Electronics", "stock": 35, "image_url": "https://i.pinimg.com/736x/62/06/40/6206409135791357.jpg"},
    {"name": "Wireless Keyboard", "description": "Compact wireless keyboard", "price": 40.00, "category": "Electronics", "stock": 50, "image_url": "https://i.pinimg.com/736x/63/07/41/6307410246802468.jpg"},
    {"name": "Noise-Cancelling Headphones", "description": "Wireless over-ear headphones with ANC", "price": 180.00, "category": "Electronics", "stock": 25, "image_url": "https://i.pinimg.com/736x/84/01/00/8401002468024680.jpg"},
    {"name": "Bluetooth Speaker Mini", "description": "Portable speaker with high bass", "price": 60.00, "category": "Electronics", "stock": 40, "image_url": "https://i.pinimg.com/736x/85/02/01/8502013579135791.jpg"},
    {"name": "Tablet Z10", "description": "10-inch tablet with stylus support", "price": 350.00, "category": "Electronics", "stock": 20, "image_url": "https://i.pinimg.com/736x/86/03/02/8603024680246802.jpg"},
    {"name": "Wireless Earbuds Pro", "description": "True wireless earbuds with charging case", "price": 120.00, "category": "Electronics", "stock": 50, "image_url": "https://i.pinimg.com/736x/87/04/03/8704035791357913.jpg"},
    {"name": "Smart Thermostat", "description": "Control home temperature remotely", "price": 200.00, "category": "Electronics", "stock": 15, "image_url": "https://i.pinimg.com/736x/88/05/04/8805046802468024.jpg"},

    # Fashion
    {"name": "Leather Jacket", "description": "Stylish leather jacket for winter", "price": 150.00, "category": "Fashion", "stock": 20, "image_url": "https://i.pinimg.com/1200x/22/c5/7b/22c57b231bfe81ec1802624fe152f7bb.jpg"},
    {"name": "Running Sneakers", "description": "Comfortable sneakers for daily runs", "price": 85.00, "category": "Fashion", "stock": 40, "image_url": "https://i.pinimg.com/736x/90/31/4d/90314d52c1d352584946458fa2c7d152.jpg"},
    {"name": "Jeans Classic", "description": "Comfortable blue jeans with straight cut", "price": 50.00, "category": "Fashion", "stock": 40, "image_url": "https://i.pinimg.com/1200x/1e/55/ba/1e55bab3241ee1f93c4eb69e2ead6ad4.jpg"},
    {"name": "Women’s Summer Dress", "description": "Lightweight floral dress", "price": 45.00, "category": "Fashion", "stock": 40, "image_url": "https://i.pinimg.com/736x/24/68/02/2468021357913579.jpg"},
    {"name": "Men’s Hoodie", "description": "Comfortable cotton hoodie", "price": 35.00, "category": "Fashion", "stock": 50, "image_url": "https://i.pinimg.com/736x/25/69/03/2569032468013579.jpg"},
    {"name": "Women’s Cardigan", "description": "Soft knit cardigan", "price": 40.00, "category": "Fashion", "stock": 30, "image_url": "https://i.pinimg.com/736x/26/70/04/2670043579024680.jpg"},
    {"name": "Men’s Polo Shirt", "description": "Casual cotton polo", "price": 30.00, "category": "Fashion", "stock": 60, "image_url": "https://i.pinimg.com/736x/27/71/05/2771054680135791.jpg"},
    {"name": "Women’s Blouse", "description": "Elegant office blouse", "price": 35.00, "category": "Fashion", "stock": 45, "image_url": "https://i.pinimg.com/736x/28/72/06/2872065790246802.jpg"},
    {"name": "Men’s T-Shirt Casual", "description": "Cotton casual t-shirt", "price": 20.00, "category": "Fashion", "stock": 70, "image_url": "https://i.pinimg.com/736x/54/98/32/5498321357913579.jpg"},
    {"name": "Women’s T-Shirt Casual", "description": "Lightweight cotton t-shirt", "price": 22.00, "category": "Fashion", "stock": 65, "image_url": "https://i.pinimg.com/736x/55/99/33/5599332468024680.jpg"},
    {"name": "Men’s Shorts", "description": "Comfortable cotton shorts", "price": 25.00, "category": "Fashion", "stock": 50, "image_url": "https://i.pinimg.com/736x/56/00/34/5600343579135791.jpg"},
    {"name": "Women’s Skirt", "description": "Elegant knee-length skirt", "price": 30.00, "category": "Fashion", "stock": 40, "image_url": "https://i.pinimg.com/736x/57/01/35/5701354680246802.jpg"},
    {"name": "Men’s Winter Coat", "description": "Warm winter coat with hood", "price": 120.00, "category": "Fashion", "stock": 25, "image_url": "https://i.pinimg.com/736x/58/02/36/5802365791357913.jpg"},
    {"name": "Women’s Leather Boots", "description": "Elegant knee-high leather boots", "price": 120.00, "category": "Fashion", "stock": 30, "image_url": "https://i.pinimg.com/736x/89/06/05/8906057913579135.jpg"},
    {"name": "Men’s Dress Shoes", "description": "Formal leather shoes for office", "price": 100.00, "category": "Fashion", "stock": 40, "image_url": "https://i.pinimg.com/736x/90/07/06/9007068024680246.jpg"},
    {"name": "Women’s Handbag Classic", "description": "Leather handbag for daily use", "price": 80.00, "category": "Fashion", "stock": 50, "image_url": "https://i.pinimg.com/736x/91/08/07/9108079135791357.jpg"},
    {"name": "Men’s Sports Cap", "description": "Cotton cap with adjustable strap", "price": 20.00, "category": "Fashion", "stock": 60, "image_url": "https://i.pinimg.com/736x/92/09/08/9209080246802468.jpg"},
    {"name": "Women’s Scarf Winter", "description": "Wool scarf for cold weather", "price": 25.00, "category": "Fashion", "stock": 70, "image_url": "https://i.pinimg.com/736x/93/10/09/9310091357913579.jpg"},

    # Accessories
    {"name": "Stylish Watch", "description": "Elegant analog watch with leather strap", "price": 60.00, "category": "Accessories", "stock": 35, "image_url": "https://i.pinimg.com/736x/58/a4/39/58a43924e62fc3f1a066e610aacb18b1.jpg"},
    {"name": "Backpack Traveler", "description": "Durable backpack with multiple compartments", "price": 45.00, "category": "Accessories", "stock": 50, "image_url": "https://i.pinimg.com/1200x/da/d2/f0/dad2f0c6e6356b85aa998a32cc769cb3.jpg"},
    {"name": "Sunglasses Aviator", "description": "Classic aviator sunglasses", "price": 25.00, "category": "Accessories", "stock": 55, "image_url": "https://i.pinimg.com/736x/35/78/07/3578076802468024.jpg"},
    {"name": "Leather Belt", "description": "Genuine leather belt", "price": 20.00, "category": "Accessories", "stock": 60, "image_url": "https://i.pinimg.com/736x/36/79/08/3679087913579135.jpg"},
    {"name": "Beanie Hat", "description": "Warm knitted beanie", "price": 15.00, "category": "Accessories", "stock": 60, "image_url": "https://i.pinimg.com/736x/69/13/47/6913476802468024.jpg"},
    {"name": "Gloves Leather", "description": "Men’s leather gloves", "price": 25.00, "category": "Accessories", "stock": 40, "image_url": "https://i.pinimg.com/736x/70/14/48/7014487913579135.jpg"},
    {"name": "Women’s Bracelet", "description": "Elegant fashion bracelet", "price": 30.00, "category": "Accessories", "stock": 50, "image_url": "https://i.pinimg.com/736x/71/15/49/7115498024680246.jpg"},
    {"name": "Necklace Women", "description": "Gold-plated fashion necklace", "price": 35.00, "category": "Accessories", "stock": 45, "image_url": "https://i.pinimg.com/736x/72/16/50/7216509135791357.jpg"},
    {"name": "Men’s Sunglasses", "description": "UV protected stylish sunglasses", "price": 20.00, "category": "Accessories", "stock": 60, "image_url": "https://i.pinimg.com/736x/73/17/51/7317510246802468.jpg"},
    {"name": "Men’s Leather Wallet", "description": "Slim wallet with multiple compartments", "price": 40.00, "category": "Accessories", "stock": 50, "image_url": "https://i.pinimg.com/736x/94/11/10/9411102468024680.jpg"},
    {"name": "Women’s Earrings Set", "description": "Gold-plated elegant earrings", "price": 30.00, "category": "Accessories", "stock": 60, "image_url": "https://i.pinimg.com/736x/95/12/11/9512113579135791.jpg"},
    {"name": "Sports Watch Tracker", "description": "Fitness tracker with heart rate monitor", "price": 90.00, "category": "Accessories", "stock": 35, "image_url": "https://i.pinimg.com/736x/96/13/12/9613124680246802.jpg"},
    {"name": "Travel Passport Holder", "description": "Durable leather holder for passports", "price": 25.00, "category": "Accessories", "stock": 40, "image_url": "https://i.pinimg.com/736x/97/14/13/9714135791357913.jpg"},

    # Home Appliances
    {"name": "Blender 5000", "description": "Powerful blender for smoothies and sauces", "price": 120.00, "category": "Home Appliances", "stock": 25, "image_url": "https://i.pinimg.com/1200x/8a/04/ab/8a04abd920b9bd476c0f70717824a879.jpg"},
    {"name": "Coffee Maker Deluxe", "description": "Automatic coffee maker with timer", "price": 75.00, "category": "Home Appliances", "stock": 15, "image_url": "https://i.pinimg.com/1200x/94/cc/e9/94cce986c85c55c7be62c2c7b27ae5ba.jpg"},
    {"name": "Electric Oven", "description": "Convection oven for baking", "price": 200.00, "category": "Home Appliances", "stock": 15, "image_url": "https://i.pinimg.com/736x/64/08/42/6408421357913579.jpg"},
    {"name": "Food Processor", "description": "Multi-functional food processor", "price": 120.00, "category": "Home Appliances", "stock": 20, "image_url": "https://i.pinimg.com/736x/65/09/43/6509432468024680.jpg"},
    {"name": "Electric Grill", "description": "Indoor electric grill for cooking", "price": 90.00, "category": "Home Appliances", "stock": 25, "image_url": "https://i.pinimg.com/736x/66/10/44/6610443579135791.jpg"},
    {"name": "Water Purifier", "description": "Countertop water purifier", "price": 150.00, "category": "Home Appliances", "stock": 30, "image_url": "https://i.pinimg.com/736x/67/11/45/6711454680246802.jpg"},
    {"name": "Coffee Grinder", "description": "Electric coffee grinder", "price": 45.00, "category": "Home Appliances", "stock": 40, "image_url": "https://i.pinimg.com/736x/68/12/46/6812465791357913.jpg"},
    {"name": "Air Fryer 5L", "description": "Healthy oil-free frying", "price": 120.00, "category": "Home Appliances", "stock": 20, "image_url": "https://i.pinimg.com/736x/98/15/14/9815146802468024.jpg"},
    {"name": "Electric Kettle", "description": "Fast boiling kettle", "price": 35.00, "category": "Home Appliances", "stock": 40, "image_url": "https://i.pinimg.com/736x/99/16/15/9916153579135791.jpg"},
    {"name": "Rice Cooker", "description": "Automatic rice cooker", "price": 50.00, "category": "Home Appliances", "stock": 25, "image_url": "https://i.pinimg.com/736x/00/17/16/0017164680246802.jpg"},

    # Toys
    {"name": "Kids Scooter", "description": "Lightweight scooter for kids", "price": 50.00, "category": "Toys", "stock": 40, "image_url": "https://i.pinimg.com/736x/74/18/52/7418521357913579.jpg"},
    {"name": "Train Set", "description": "Electric train set with tracks", "price": 80.00, "category": "Toys", "stock": 30, "image_url": "https://i.pinimg.com/736x/75/19/53/7519532468024680.jpg"},
    {"name": "Puzzle Cube 3x3", "description": "Classic Rubik’s cube puzzle", "price": 10.00, "category": "Toys", "stock": 100, "image_url": "https://i.pinimg.com/736x/76/20/54/7620543579135791.jpg"},
    {"name": "Remote Car Racer", "description": "High-speed remote control car", "price": 60.00, "category": "Toys", "stock": 35, "image_url": "https://i.pinimg.com/736x/77/21/55/7721554680246802.jpg"},
    {"name": "Building Blocks Mega", "description": "Mega-size building block set", "price": 70.00, "category": "Toys", "stock": 40, "image_url": "https://i.pinimg.com/736x/78/22/56/7822565791357913.jpg"},
    {"name": "Dollhouse Deluxe", "description": "Complete dollhouse with furniture", "price": 150.00, "category": "Toys", "stock": 20, "image_url": "https://i.pinimg.com/736x/01/23/45/0123453579135791.jpg"},
    {"name": "Remote Helicopter", "description": "RC helicopter with lights", "price": 90.00, "category": "Toys", "stock": 25, "image_url": "https://i.pinimg.com/736x/02/24/46/0224464680246802.jpg"},
    {"name": "Board Game Classic", "description": "Family board game", "price": 35.00, "category": "Toys", "stock": 50, "image_url": "https://i.pinimg.com/736x/03/25/47/0325475791357913.jpg"},

    # Books
    {"name": "Romance Novel", "description": "Heartwarming romance story", "price": 18.00, "category": "Books", "stock": 60, "image_url": "https://i.pinimg.com/736x/79/23/57/7923576802468024.jpg"},
    {"name": "Self-Help Book", "description": "Guide to personal development", "price": 25.00, "category": "Books", "stock": 50, "image_url": "https://i.pinimg.com/736x/80/24/58/8024587913579135.jpg"},
    {"name": "Art Book", "description": "Inspiring art collection", "price": 40.00, "category": "Books", "stock": 30, "image_url": "https://i.pinimg.com/736x/81/25/59/8125598024680246.jpg"},
    {"name": "Biography Book", "description": "Life story of a famous personality", "price": 30.00, "category": "Books", "stock": 45, "image_url": "https://i.pinimg.com/736x/82/26/60/8226609135791357.jpg"},
    {"name": "Children’s Activity Book", "description": "Fun educational activities for kids", "price": 15.00, "category": "Books", "stock": 90, "image_url": "https://i.pinimg.com/736x/83/27/61/8327610246802468.jpg"},
    {"name": "Cookbook Healthy", "description": "Delicious healthy recipes", "price": 35.00, "category": "Books", "stock": 40, "image_url": "https://i.pinimg.com/736x/04/28/62/0428623579135791.jpg"},
    {"name": "Travel Guide Europe", "description": "Explore Europe travel tips", "price": 25.00, "category": "Books", "stock": 50, "image_url": "https://i.pinimg.com/736x/05/29/63/0529634680246802.jpg"},
    {"name": "Science Book Kids", "description": "Fun science experiments for kids", "price": 20.00, "category": "Books", "stock": 70, "image_url": "https://i.pinimg.com/736x/06/30/64/0630645791357913.jpg"},

    # Sports
    {"name": "Dumbbell Set", "description": "Adjustable dumbbells for home workouts", "price": 150.00, "category": "Sports", "stock": 15, "image_url": "https://i.pinimg.com/736x/12/29/28/1229286802468024.jpg"},
    {"name": "Jump Rope", "description": "Adjustable speed jump rope", "price": 20.00, "category": "Sports", "stock": 100, "image_url": "https://i.pinimg.com/736x/13/30/29/1330297913579135.jpg"},
    {"name": "Yoga Mat Premium", "description": "Non-slip yoga mat", "price": 35.00, "category": "Sports", "stock": 50, "image_url": "https://i.pinimg.com/736x/14/31/30/1431304680246802.jpg"},
    {"name": "Tennis Racket Pro", "description": "Lightweight tennis racket", "price": 80.00, "category": "Sports", "stock": 20, "image_url": "https://i.pinimg.com/736x/15/32/31/1532315791357913.jpg"},

    # Beauty
    {"name": "Facial Cleanser", "description": "Gentle daily facial cleanser", "price": 25.00, "category": "Beauty", "stock": 50, "image_url": "https://i.pinimg.com/736x/16/33/32/1633326802468024.jpg"},
    {"name": "Lipstick Set", "description": "Matte lipstick collection", "price": 35.00, "category": "Beauty", "stock": 40, "image_url": "https://i.pinimg.com/736x/17/34/33/1734337913579135.jpg"},
    {"name": "Perfume Eau De Parfum", "description": "Long-lasting fragrance", "price": 70.00, "category": "Beauty", "stock": 30, "image_url": "https://i.pinimg.com/736x/18/35/34/1835344680246802.jpg"},
    {"name": "Nail Polish Set", "description": "Vibrant nail colors for all occasions", "price": 20.00, "category": "Beauty", "stock": 60, "image_url": "https://i.pinimg.com/736x/19/36/35/1936355791357913.jpg"},

    # Kitchen
    {"name": "Knife Set", "description": "Stainless steel kitchen knife set", "price": 80.00, "category": "Kitchen", "stock": 20, "image_url": "https://i.pinimg.com/736x/20/37/36/2037366802468024.jpg"},
    {"name": "Non-stick Pan", "description": "High-quality frying pan", "price": 50.00, "category": "Kitchen", "stock": 35, "image_url": "https://i.pinimg.com/736x/21/38/37/2138377913579135.jpg"},
    {"name": "Cutting Board", "description": "Durable bamboo cutting board", "price": 25.00, "category": "Kitchen", "stock": 40, "image_url": "https://i.pinimg.com/736x/22/39/38/2239386802468024.jpg"},
    {"name": "Mixing Bowls Set", "description": "Stainless steel mixing bowls", "price": 40.00, "category": "Kitchen", "stock": 25, "image_url": "https://i.pinimg.com/736x/23/40/39/2340393579135791.jpg"}
]

def seed():
    app = create_app()
    with app.app_context():
        # 1. Delete everything
        db.session.query(Product).delete()
        db.session.query(User).delete()
        db.session.commit()

        # 2. Add users
        for u in DEMO_USERS:
            user = User(username=u['username'], email=u['email'], password_hash=hash_password(u['password']))
            db.session.add(user)

        # 3. Add products
        for p in PRODUCTS:
            product = Product(
                name=p['name'],
                description=p['description'],
                price=p['price'],
                category=p['category'],
                stock=p['stock'],
                image_url=p['image_url']
            )
            db.session.add(product)

        db.session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    seed()
