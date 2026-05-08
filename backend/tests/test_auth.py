import pytest
from src.core.security import get_password_hash
from src.domain.models import User
import uuid

def test_register_user(client):
    response = client.post(
        "/v1/auth/register",
        json={"email": "new@example.com", "password": "password123", "full_name": "New User"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "new@example.com"

def test_register_duplicate_email(client, db):
    # Setup: create a user
    user = User(email="dup@example.com", hashed_password="...", full_name="...")
    db.add(user)
    db.commit()

    response = client.post(
        "/v1/auth/register",
        json={"email": "dup@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client, db):
    # Setup: create user with hashed password
    email = "login@example.com"
    password = "secretpassword"
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name="Login User"
    )
    db.add(user)
    db.commit()

    response = client.post(
        "/v1/auth/token",
        data={"username": email, "password": password}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_incorrect_password(client, db):
    email = "wrongpass@example.com"
    user = User(
        email=email,
        hashed_password=get_password_hash("realpassword")
    )
    db.add(user)
    db.commit()

    response = client.post(
        "/v1/auth/token",
        data={"username": email, "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
