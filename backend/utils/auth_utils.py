# backend/utils/auth_utils.py

from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


def hash_password(plain_password: str) -> str:
    """
    Hash a plaintext password (returns string)
    """
    return bcrypt.generate_password_hash(plain_password).decode("utf-8")


def check_password(hashed_password: str, plain_password: str) -> bool:
    """
    Verify a plaintext password against a stored hash.
    """
    return bcrypt.check_password_hash(hashed_password, plain_password)
