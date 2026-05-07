import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found")
    exit(1)

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("Fixing null missing_ingredients in recipes table...")
    try:
        # Set missing_ingredients to '[]' if it's currently NULL
        conn.execute(text("UPDATE recipes SET missing_ingredients = '[]' WHERE missing_ingredients IS NULL"))
        conn.commit()
        print("Successfully updated NULL values to empty list.")
    except Exception as e:
        print(f"Error: {e}")
