from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User, IngredientItem
from src.domain.schemas import RecipeListResponse
from src.services.recipe_service import RecipeGenerationEngine

router = APIRouter(prefix="/v1/recipes", tags=["recipes"])
engine = RecipeGenerationEngine()

@router.post("/generate", response_model=RecipeListResponse)
async def generate_ai_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes the user's current pantry and generates 3 tailored recipes using AI.
    """
    # 1. Fetch user's current ingredients
    ingredients = db.query(IngredientItem)\
        .filter(IngredientItem.user_id == current_user.id)\
        .all()

    if not ingredients:
        raise HTTPException(
            status_code=400, 
            detail="Your pantry is empty. Please scan some ingredients first!"
        )

    # 2. Extract unique ingredient names
    ingredient_names = list(set([ing.name for ing in ingredients]))

    try:
        # 3. Generate recipes via NIM Engine
        result = engine.generate_recipes(ingredient_names)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"AI Recipe Generation failed: {str(e)}"
        )
