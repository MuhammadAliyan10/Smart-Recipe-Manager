import pytest
from unittest.mock import MagicMock
from src.services.recipe_service import RecipeGenerationEngine
from src.domain.schemas import RecipeListResponse, Recipe

def test_generate_recipes_empty_pantry(client):
    # Ensure pantry is empty (test_user is fresh)
    response = client.post("/v1/recipes/generate", json={})
    assert response.status_code == 400
    assert "pantry is empty" in response.json()["detail"]

def test_generate_recipes_success(client, mocker):
    # Setup: add an ingredient to pantry
    client.post("/v1/ingredients", json={"name": "Egg", "quantity": "2", "category": "Protein"})

    # Mock the AI engine
    mock_recipes = [
        {
            "title": "Mock Omelette",
            "matchPercentage": 100,
            "time": "5 min",
            "calories": "200 kcal",
            "ingredients": ["Egg"],
            "instructions": ["Crack egg", "Fry egg"],
            "missing_ingredients": [],
            "substitutes": []
        }
    ]
    
    # We need to mock 'generate_recipes' on the instance or class
    # Since it's instantiated at module level in src/api/recipes.py, 
    # we mock the class or the instance in the router
    from src.api.recipes import engine
    mocker.patch.object(engine, 'generate_recipes', return_value=RecipeListResponse(recipes=mock_recipes))

    response = client.post("/v1/recipes/generate", json={"preferences": "healthy"})
    assert response.status_code == 200
    assert response.json()["recipes"][0]["title"] == "Mock Omelette"

def test_get_recipe_history(client, mocker):
    # Add a mock recipe to history (can use success test or direct DB)
    client.post("/v1/ingredients", json={"name": "Egg", "quantity": "2", "category": "Protein"})
    
    mock_recipes = [
        {
            "title": "Mock History Recipe",
            "matchPercentage": 90,
            "time": "10 min",
            "calories": "300 kcal",
            "ingredients": ["Egg"],
            "instructions": ["..."],
            "missing_ingredients": [],
            "substitutes": []
        }
    ]
    from src.api.recipes import engine
    mocker.patch.object(engine, 'generate_recipes', return_value=RecipeListResponse(recipes=mock_recipes))
    
    client.post("/v1/recipes/generate", json={})
    
    response = client.get("/v1/recipes/history")
    assert response.status_code == 200
    assert len(response.json()["recipes"]) >= 1
    assert response.json()["recipes"][0]["title"] == "Mock History Recipe"
