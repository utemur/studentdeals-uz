import type { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse, UserDTO } from '@studentdeals/types';

/**
 * Get API URL based on environment
 */
function getApiUrl(): string {
  // Explicit API URL override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Environment-based resolution
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  
  switch (env) {
    case 'staging':
      return 'https://api-staging.studentdeals.uz';
    case 'production':
      return 'https://studentdeals-uz.onrender.com';
    default:
      return 'http://localhost:3001';
  }
}

const API_URL = getApiUrl();

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
