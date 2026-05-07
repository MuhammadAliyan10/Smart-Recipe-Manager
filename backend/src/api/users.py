from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import User
from src.domain.schemas import UserRead, UserUpdate

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
