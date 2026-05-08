// src/api/users.ts
import client from './client';

export interface UserUpdateData {
  full_name?: string;
  pfp_url?: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
}

/**
 * Updates the current user's profile information.
 */
export const updateProfile = async (data: UserUpdateData) => {
  const response = await client.patch('/v1/users/me', data);
  return response.data;
};

/**
 * Changes the current user's password.
 */
export const changePassword = async (data: PasswordUpdateData) => {
  const response = await client.put('/v1/users/me/password', data);
  return response.data;
};

/**
 * Exports all user data as a consolidated JSON object.
 */
export const exportUserData = async () => {
  const response = await client.get('/v1/users/me/export');
  return response.data;
};

/**
 * Permanently deletes the user account.
 */
export const deleteAccount = async () => {
  await client.delete('/v1/users/me');
};
