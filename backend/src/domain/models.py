import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.core.database import Base

class User(Base):
    """
    SQLAlchemy model for user authentication and profiles.
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    pfp_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    ingredients = relationship("IngredientItem", back_populates="owner", cascade="all, delete-orphan")
    recipes = relationship("SavedRecipe", back_populates="owner", cascade="all, delete-orphan")
    shopping_list = relationship("ShoppingItem", back_populates="owner", cascade="all, delete-orphan")

class IngredientItem(Base):
    """
    SQLAlchemy model for persistent ingredient storage.
    """
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String)
    category = Column(String)
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # User linkage
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner = relationship("User", back_populates="ingredients")

class SavedRecipe(Base):
    """
    SQLAlchemy model for storing AI-generated recipes.
    """
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    match_percentage = Column(Integer)
    time = Column(String)
    calories = Column(String)
    ingredients = Column(JSON) # List[str]
    instructions = Column(JSON) # List[str]
    missing_ingredients = Column(JSON) # List[str]
    substitutes = Column(JSON) # List[dict]
    created_at = Column(DateTime, default=datetime.utcnow)

    # User linkage
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")

class ShoppingItem(Base):
    """
    SQLAlchemy model for user shopping list items.
    """
    __tablename__ = "shopping_list"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_purchased = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # User linkage
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner = relationship("User", back_populates="shopping_list")
