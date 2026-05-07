import os
import shutil
import uuid
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.security import get_current_user
from src.domain.models import IngredientItem, User
from src.domain.schemas import PersistenceResponse, IngredientResponse
from src.services.extraction_service import ImageExtractionEngine

router = APIRouter(prefix="/v1")
engine = ImageExtractionEngine()

@router.post("/extract", response_model=PersistenceResponse)
async def extract_and_persist_food_data(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint to receive an image, process it, persist to DB for current user, and return saved records.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_extension = os.path.splitext(file.filename)[1]
    temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_extension}")

    try:
        # 1. Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Extract data via AI engine
        extraction = engine.extract_data(temp_file_path)

        # 3. Persist to Database with Ownership
        saved_items = []
        for ing in extraction.ingredients:
            db_item = IngredientItem(
                name=ing.name,
                quantity=ing.quantity,
                category=ing.category,
                confidence_score=ing.confidence_score,
                user_id=current_user.id
            )
            db.add(db_item)
            saved_items.append(db_item)
        
        db.commit()
        
        # Refresh to get IDs and timestamps
        for item in saved_items:
            db.refresh(item)

        return PersistenceResponse(
            saved_items=saved_items,
            unrecognized_text=extraction.unrecognized_text
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
