from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User, IngredientItem
from src.domain.schemas import IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/history", response_model=List[IngredientResponse])
def read_ingredient_history(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns ingredient records belonging strictly to the authenticated user.
    """
    history = db.query(IngredientItem)\
        .filter(IngredientItem.user_id == current_user.id)\
        .order_by(IngredientItem.created_at.desc())\
        .limit(limit)\
        .offset(offset)\
        .all()
    return history
