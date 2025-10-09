import { cookies } from 'next/headers';
import { authApi } from './api';
import type { UserDTO } from '@studentdeals/types';

/**
 * Server-side auth helper
 * Get current user from httpOnly cookie
 */
export async function getCurrentUser(): Promise<UserDTO | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sd_token')?.value;

    if (!token) {
      return null;
    }

    const user = await authApi.me(token);
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

