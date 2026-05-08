import pytest

def test_add_ingredient(client):
    response = client.post(
        "/v1/ingredients",
        json={"name": "Tomato", "quantity": "2 units", "category": "Produce"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Tomato"
    assert response.json()["category"] == "Produce"

def test_get_ingredients_history(client):
    # Add an item first
    client.post("/v1/ingredients", json={"name": "Onion", "quantity": "1", "category": "Produce"})
    
    response = client.get("/v1/ingredients/history")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["name"] == "Onion"

def test_pydantic_validation_invalid_category(client):
    # Invalid category (not in the regex pattern)
    response = client.post(
        "/v1/ingredients",
        json={"name": "Milk", "quantity": "1L", "category": "InvalidCategory"}
    )
    assert response.status_code == 422
    assert "category" in response.json()["detail"][0]["loc"]

def test_pydantic_validation_empty_fields(client):
    # Empty name (min_length=1)
    response = client.post(
        "/v1/ingredients",
        json={"name": "", "quantity": "1", "category": "Dairy"}
    )
    assert response.status_code == 422

def test_delete_ingredient(client):
    # Add item
    add_resp = client.post("/v1/ingredients", json={"name": "DeleteMe", "quantity": "1", "category": "Other"})
    item_id = add_resp.json()["id"]

    # Delete item
    del_resp = client.delete(f"/v1/ingredients/{item_id}")
    assert del_resp.status_code == 204

    # Verify gone
    hist_resp = client.get("/v1/ingredients/history")
    items = hist_resp.json()
    assert not any(item["id"] == item_id for item in items)
