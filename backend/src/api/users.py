from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user, verify_password, get_password_hash
from src.domain.models import User
from src.domain.schemas import UserRead, UserUpdate, PasswordUpdate

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserRead)
def update_user_me(
    user_update: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.pfp_url is not None:
        current_user.pfp_url = user_update.pfp_url
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def change_password(
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.add(current_user)
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.get("/me/export")
def export_user_data(current_user: User = Depends(get_current_user)):
    """
    Consolidates all user data (profile, pantry, recipes, shopping list) into a single JSON.
    """
    return {
        "profile": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        },
        "pantry": [
            {
                "name": item.name,
                "quantity": item.quantity,
                "category": item.category,
                "added_at": item.created_at.isoformat()
            } for item in current_user.ingredients
        ],
        "recipes": [
            {
                "title": r.title,
                "time": r.time,
                "calories": r.calories,
                "ingredients": r.ingredients,
                "instructions": r.instructions
            } for r in current_user.recipes
        ],
        "shopping_list": [
            {
                "name": item.name,
                "is_purchased": item.is_purchased
            } for item in current_user.shopping_list
        ]
    }

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Permanently deletes the user account and all associated data via cascade.
    """
    db.delete(current_user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
