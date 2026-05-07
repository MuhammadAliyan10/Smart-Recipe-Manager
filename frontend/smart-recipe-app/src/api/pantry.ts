// src/api/pantry.ts
import client from './client';

export interface IngredientItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  confidence_score: number;
  created_at: string;
}

/**
 * Fetches the user's ingredient history from the backend.
 */
export const fetchPantryItems = async (): Promise<IngredientItem[]> => {
  try {
    const response = await client.get('/v1/ingredients/history', {
      params: { limit: 50, offset: 0 }
    });
    return response.data;
  } catch (error) {
    console.error("[API] Failed to fetch pantry items:", error);
    throw error;
  }
};

/**
 * Manually adds a single item to the pantry.
 */
export const addPantryItem = async (data: Omit<IngredientItem, 'id' | 'confidence_score' | 'created_at'>): Promise<IngredientItem> => {
  try {
    const response = await client.post<IngredientItem>('/v1/ingredients', data);
    return response.data;
  } catch (error) {
    console.error("[API] Failed to add pantry item:", error);
    throw error;
  }
};

/**
 * Updates an existing pantry item.
 */
export const updatePantryItem = async (id: number, data: Partial<IngredientItem>): Promise<IngredientItem> => {
  try {
    const response = await client.put<IngredientItem>(`/v1/ingredients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`[API] Failed to update item ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a specific ingredient from the pantry.
 */
export const deletePantryItem = async (id: number | string): Promise<void> => {
  try {
    await client.delete(`/v1/ingredients/${id}`);
  } catch (error) {
    console.error(`[API] Failed to delete item ${id}:`, error);
    throw error;
  }
};
