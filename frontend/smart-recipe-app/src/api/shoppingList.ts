// src/api/shoppingList.ts
import client from './client';

export interface ShoppingItem {
  id: number;
  name: string;
  is_purchased: boolean;
  created_at: string;
}

/**
 * Fetch all items in the shopping list.
 */
export const fetchShoppingList = async (): Promise<ShoppingItem[]> => {
  try {
    const response = await client.get<ShoppingItem[]>('/v1/shopping-list');
    return response.data;
  } catch (error) {
    console.error("[API] Failed to fetch shopping list:", error);
    throw error;
  }
};

/**
 * Bulk add ingredient names to the shopping list.
 */
export const addToShoppingList = async (names: string[]): Promise<ShoppingItem[]> => {
  try {
    const response = await client.post<ShoppingItem[]>('/v1/shopping-list', { names });
    return response.data;
  } catch (error) {
    console.error("[API] Failed to add to shopping list:", error);
    throw error;
  }
};

/**
 * Toggle the purchased state of an item.
 */
export const toggleShoppingItem = async (id: number, isPurchased: boolean): Promise<ShoppingItem> => {
  try {
    const response = await client.put<ShoppingItem>(`/v1/shopping-list/${id}`, {
      is_purchased: isPurchased
    });
    return response.data;
  } catch (error) {
    console.error("[API] Failed to toggle shopping item:", error);
    throw error;
  }
};

/**
 * Delete an item from the shopping list.
 */
export const deleteShoppingItem = async (id: number): Promise<void> => {
  try {
    await client.delete(`/v1/shopping-list/${id}`);
  } catch (error) {
    console.error("[API] Failed to delete shopping item:", error);
    throw error;
  }
};
