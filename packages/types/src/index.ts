// User types
export * from './user';
import { UserDTO } from './user';

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
