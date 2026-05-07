from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User, IngredientItem, SavedRecipe
from src.domain.schemas import RecipeListResponse, RecipeGenerationRequest, Recipe as RecipeSchema
from src.services.recipe_service import RecipeGenerationEngine

router = APIRouter(prefix="/v1/recipes", tags=["recipes"])
engine = RecipeGenerationEngine()

@router.post("/generate", response_model=RecipeListResponse)
async def generate_ai_recipes(
    request: RecipeGenerationRequest = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes the user's current pantry and generates 3 tailored recipes using AI.
    Saves the generated recipes to the database for future reference.
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

    ingredient_names = [f"{ing.name} ({ing.quantity})" for ing in ingredients]
    preferences = request.preferences if request else None

    try:
        # 2. Generate recipes via NIM Engine
        result = engine.generate_recipes(ingredient_names, preferences=preferences)
        
        # 3. Persist recipes to DB
        saved_objs = []
        for r in result.recipes:
            new_recipe = SavedRecipe(
                title=r.title,
                match_percentage=r.matchPercentage,
                time=r.time,
                calories=r.calories,
                ingredients=r.ingredients,
                instructions=r.instructions,
                missing_ingredients=r.missing_ingredients,
                substitutes=[s.model_dump() for s in r.substitutes],
                user_id=current_user.id
            )
            db.add(new_recipe)
            saved_objs.append(new_recipe)
        
        db.commit()
        
        # 4. Refresh to get IDs/dates and return
        for obj in saved_objs:
            db.refresh(obj)
            
        return RecipeListResponse(
            recipes=[RecipeSchema.model_validate(obj) for obj in saved_objs]
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"AI Recipe Generation failed: {str(e)}"
        )

@router.get("/history", response_model=RecipeListResponse)
async def get_recipe_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all previously generated recipes for the current user.
    """
    recipes = db.query(SavedRecipe)\
        .filter(SavedRecipe.user_id == current_user.id)\
        .order_by(SavedRecipe.created_at.desc())\
        .all()
    
    return RecipeListResponse(
        recipes=[RecipeSchema.model_validate(r) for r in recipes]
    )

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes a specific recipe from the user's history.
    """
    recipe = db.query(SavedRecipe)\
        .filter(SavedRecipe.id == recipe_id, SavedRecipe.user_id == current_user.id)\
        .first()
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db.delete(recipe)
    db.commit()
    return None
