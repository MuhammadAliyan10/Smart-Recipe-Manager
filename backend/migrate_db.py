import os
from sqlalchemy import create_engine, text
from src.core.database import DATABASE_URL

def migrate():
    """
    Manually add missing columns to the recipes table.
    """
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("[MIGRATION] Checking for missing column 'missing_ingredients' in 'recipes' table...")
        try:
            conn.execute(text("ALTER TABLE recipes ADD COLUMN IF NOT EXISTS missing_ingredients JSON DEFAULT '[]'"))
            conn.commit()
            print("[MIGRATION] Column 'missing_ingredients' verified/added.")
        except Exception as e:
            print(f"[MIGRATION] Error adding missing_ingredients: {e}")

        print("[MIGRATION] Checking for missing column 'substitutes' in 'recipes' table...")
        try:
            conn.execute(text("ALTER TABLE recipes ADD COLUMN IF NOT EXISTS substitutes JSON DEFAULT '[]'"))
            conn.commit()
            print("[MIGRATION] Column 'substitutes' verified/added.")
        except Exception as e:
            print(f"[MIGRATION] Error adding substitutes: {e}")

if __name__ == "__main__":
    migrate()
