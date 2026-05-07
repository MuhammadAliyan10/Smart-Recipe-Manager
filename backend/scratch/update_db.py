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
    print("Checking for missing_ingredients column in recipes table...")
    try:
        # Add column if it doesn't exist
        conn.execute(text("ALTER TABLE recipes ADD COLUMN IF NOT EXISTS missing_ingredients JSON"))
        conn.commit()
        print("Successfully added missing_ingredients column.")
    except Exception as e:
        print(f"Error: {e}")
