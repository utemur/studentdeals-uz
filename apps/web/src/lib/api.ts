import type { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse, UserDTO } from '@studentdeals/types';

/**
 * Get API URL based on environment
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Universal API helper
 * @param path - API endpoint path (e.g., '/health', '/auth/login')
 * @param init - Fetch options
 * @returns Response data as JSON
 */
export async function api(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  
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
    let errorData: any = {};
    
    try {
      const errorJson = JSON.parse(errorText);
      // NestJS returns { statusCode, message } for exceptions
      // If message is an object with error property, extract it
      if (errorJson.message && typeof errorJson.message === 'object' && errorJson.message.error) {
        errorData = errorJson.message;
        errorMessage = errorJson.message.message || errorJson.message.error || errorMessage;
      } else {
        errorMessage = errorJson.message || errorJson.error || errorMessage;
        errorData = errorJson;
      }
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.data = errorData;
    error.response = { status: response.status, data: errorData };
    throw error;
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
