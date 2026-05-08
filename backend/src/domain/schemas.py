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

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

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

class IngredientManualCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    quantity: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., pattern="^(Produce|Dairy|Protein|Pantry|Spices|Snacks|Beverages|Other)$")

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

# --- Recipe Schemas ---

class RecipeSubstitute(BaseModel):
    original: str
    substitute: str
    model_config = ConfigDict(from_attributes=True)

class Recipe(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., min_length=1, max_length=200, description="Appealing title of the recipe")
    match_percentage: int = Field(..., alias="matchPercentage", ge=0, le=100, description="How well this recipe matches user ingredients (0-100)")
    time: str = Field(..., min_length=1, max_length=50, description="Prep and cook time (e.g., '25 min')")
    calories: str = Field(..., min_length=1, max_length=50, description="Estimated calories per serving")
    ingredients: List[str] = Field(..., description="List of key ingredient names used")
    instructions: List[str] = Field(..., description="Step-by-step cooking instructions")
    missing_ingredients: Optional[List[str]] = Field(default_factory=list, description="Ingredients the user is missing or has insufficient quantity of")
    substitutes: List[RecipeSubstitute] = Field(default_factory=list, description="Suggested ingredient substitutes")
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class RecipeListResponse(BaseModel):
    recipes: List[Recipe]

class RecipeGenerationRequest(BaseModel):
    preferences: Optional[str] = Field(None, max_length=500, description="Optional user preferences for recipe generation")

# --- Shopping List Schemas ---

class ShoppingItemBase(BaseModel):
    name: str
    is_purchased: bool = False

class ShoppingItemCreate(BaseModel):
    names: List[str]

class ShoppingItemResponse(ShoppingItemBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ShoppingItemUpdate(BaseModel):
    is_purchased: bool
