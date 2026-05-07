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
 * This represents the active inventory/pantry data.
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
