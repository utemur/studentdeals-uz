// User types
export interface UserDTO {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface LoginResponse extends AuthResponse {
  user?: UserDTO;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

// Offer types
export interface OfferDTO {
  id: string;
  title: string;
}
