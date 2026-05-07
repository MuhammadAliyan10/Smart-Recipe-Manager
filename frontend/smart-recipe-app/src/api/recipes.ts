// src/api/recipes.ts
import client from './client';

export interface RecipeSubstitute {
  original: string;
  substitute: string;
}

export interface Recipe {
  id: number; // ID is required for history and deletion
  title: string;
  matchPercentage: number;
  time: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
  missing_ingredients: string[];
  substitutes: RecipeSubstitute[];
  created_at?: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
}

/**
 * Triggers the AI recipe generation based on the user's current pantry.
 * Supports optional user preferences.
 */
export const generateRecipes = async (preferences?: string): Promise<Recipe[]> => {
  try {
    const response = await client.post<RecipeListResponse>('/v1/recipes/generate', {
      preferences: preferences || null
    });
    return response.data.recipes;
  } catch (error) {
    console.error("[API] Failed to generate recipes:", error);
    throw error;
  }
};

/**
 * Fetches the history of saved recipes for the current user.
 */
export const getRecipeHistory = async (skip: number = 0, limit: number = 10): Promise<Recipe[]> => {
  try {
    const response = await client.get<RecipeListResponse>('/v1/recipes/history', {
      params: { limit, offset: skip }
    });
    return response.data.recipes;
  } catch (error) {
    console.error("[API] Failed to fetch recipe history:", error);
    throw error;
  }
};

/**
 * Deletes a recipe from the user's history.
 */
export const deleteRecipe = async (id: number | string): Promise<void> => {
  try {
    await client.delete(`/v1/recipes/${id}`);
  } catch (error) {
    console.error(`[API] Failed to delete recipe ${id}:`, error);
    throw error;
  }
};

/**
 * Manually creates a new recipe.
 */
export const createManualRecipe = async (data: Partial<Recipe>): Promise<Recipe> => {
  try {
    const response = await client.post<Recipe>('/v1/recipes', data);
    return response.data;
  } catch (error) {
    console.error("[API] Failed to create manual recipe:", error);
    throw error;
  }
};

/**
 * Updates an existing recipe.
 */
export const updateRecipe = async (id: number | string, data: Partial<Recipe>): Promise<Recipe> => {
  try {
    const response = await client.put<Recipe>(`/v1/recipes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`[API] Failed to update recipe ${id}:`, error);
    throw error;
  }
};
