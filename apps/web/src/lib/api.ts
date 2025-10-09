import type { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse, UserDTO } from '@studentdeals/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Universal API helper
 * @param path - API endpoint path (e.g., '/health', '/auth/login')
 * @param init - Fetch options
 * @returns Response data as JSON
 */
export async function api(path: string, init?: RequestInit) {
  const url = `${API_URL}${path}`;
  
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Auth API helpers
 */
export const authApi = {
  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user (returns JWT token)
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user profile
   */
  async me(token: string): Promise<UserDTO> {
    return api('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
