import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from src.core.database import engine, Base
from src.domain import models  # Ensure models are imported for metadata
from src.api.routes import router as extraction_router
from src.api.auth import router as auth_router
from src.api.users import router as user_router
from src.api.ingredients import router as history_router
from src.api.recipes import router as recipe_router
from src.api.shopping_list import router as shopping_router
from src.core.ratelimit import limiter

# Initialize database schema in Neon
print("[BOOT] Connecting to Neon and verifying schema...")
Base.metadata.create_all(bind=engine)
print("[BOOT] Database schema verified.")

app = FastAPI(
    title="Smart Recipe Manager - Extraction Engine",
    description="Headless data ingestion pipeline for food inventory systems.",
    version="1.1.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Global exception handler for library-level ValueErrors (like bcrypt 72-char limit)
@app.exception_handler(ValueError)
async def value_error_exception_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth_router, prefix="/v1")
app.include_router(user_router, prefix="/v1")
app.include_router(history_router, prefix="/v1")
app.include_router(recipe_router)
app.include_router(extraction_router)
app.include_router(shopping_router)

@app.get("/health")
async def health_check():
    """
    Uptime monitoring endpoint.
    """
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
