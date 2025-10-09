const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SignupData {
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

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

// Legacy API methods (using new api helper)
export const authApi = {
  async signup(data: SignupData): Promise<AuthResponse> {
    return api('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async signin(data: SigninData): Promise<AuthResponse> {
    return api('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfile(token: string) {
    return api('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
