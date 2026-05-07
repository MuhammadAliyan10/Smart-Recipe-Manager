from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User, ShoppingItem
from src.domain.schemas import ShoppingItemResponse, ShoppingItemCreate, ShoppingItemUpdate

router = APIRouter(prefix="/v1/shopping-list", tags=["shopping-list"])

@router.get("", response_model=List[ShoppingItemResponse])
async def get_shopping_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch all shopping list items for the current user.
    """
    return db.query(ShoppingItem)\
        .filter(ShoppingItem.user_id == current_user.id)\
        .order_by(ShoppingItem.created_at.desc())\
        .all()

@router.post("", response_model=List[ShoppingItemResponse])
async def add_to_shopping_list(
    request: ShoppingItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bulk-add ingredient names to the user's shopping list.
    """
    new_items = []
    for name in request.names:
        if not name.strip(): continue
        item = ShoppingItem(name=name, user_id=current_user.id)
        db.add(item)
        new_items.append(item)
    
    db.commit()
    for item in new_items:
        db.refresh(item)
    return new_items

@router.put("/{item_id}", response_model=ShoppingItemResponse)
async def toggle_shopping_item(
    item_id: int,
    request: ShoppingItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Toggle the is_purchased state of a shopping list item.
    """
    item = db.query(ShoppingItem)\
        .filter(ShoppingItem.id == item_id, ShoppingItem.user_id == current_user.id)\
        .first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.is_purchased = request.is_purchased
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shopping_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove an item from the shopping list.
    """
    item = db.query(ShoppingItem)\
        .filter(ShoppingItem.id == item_id, ShoppingItem.user_id == current_user.id)\
        .first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return None
