// src/api/recipes.ts
import client from './client';

export interface Recipe {
  title: string;
  matchPercentage: number;
  time: string;
  calories: string;
  ingredients: string[];
}

export interface RecipeListResponse {
  recipes: Recipe[];
}

/**
 * Triggers the AI recipe generation based on the user's current pantry.
 */
export const generateRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await client.post<RecipeListResponse>('/v1/recipes/generate');
    return response.data.recipes;
  } catch (error) {
    console.error("[API] Failed to generate recipes:", error);
    throw error;
  }
};
