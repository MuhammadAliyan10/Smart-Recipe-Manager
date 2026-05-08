from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User, IngredientItem
from src.domain.schemas import IngredientResponse, IngredientBase, IngredientManualCreate

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/history", response_model=List[IngredientResponse])
def read_ingredient_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns ingredient records belonging strictly to the authenticated user.
    """
    safe_limit = min(limit, 100)
    safe_offset = max(offset, 0)
    history = db.query(IngredientItem)\
        .filter(IngredientItem.user_id == current_user.id)\
        .order_by(IngredientItem.created_at.desc())\
        .limit(safe_limit)\
        .offset(safe_offset)\
        .all()
    return history

@router.post("", response_model=IngredientResponse)
def add_ingredient(
    item: IngredientManualCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually add a single ingredient item to the user's pantry.
    """
    db_item = IngredientItem(
        name=item.name,
        quantity=item.quantity,
        category=item.category,
        confidence_score=1.0, # Manual entry is 100% confident
        user_id=current_user.id
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=IngredientResponse)
def update_ingredient(
    item_id: int,
    item_update: IngredientManualCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing ingredient's details.
    """
    db_item = db.query(IngredientItem)\
        .filter(IngredientItem.id == item_id, IngredientItem.user_id == current_user.id)\
        .first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    db_item.name = item_update.name
    db_item.quantity = item_update.quantity
    db_item.category = item_update.category
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingredient(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove an ingredient from the pantry.
    """
    db_item = db.query(IngredientItem)\
        .filter(IngredientItem.id == item_id, IngredientItem.user_id == current_user.id)\
        .first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    db.delete(db_item)
    db.commit()
    return None
