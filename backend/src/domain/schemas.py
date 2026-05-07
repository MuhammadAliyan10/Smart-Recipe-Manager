from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from uuid import UUID

# --- User Schemas ---

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserRead(UserBase):
    id: UUID
    pfp_url: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    pfp_url: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- Ingredient Schemas ---

class IngredientBase(BaseModel):
    name: str
    quantity: str
    category: str
    confidence_score: float

class IngredientCreate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ExtractionResult(BaseModel):
    ingredients: List[IngredientCreate]
    unrecognized_text: str

class PersistenceResponse(BaseModel):
    saved_items: List[IngredientResponse]
    unrecognized_text: str
