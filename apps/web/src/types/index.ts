/**
 * Core types for StudentDeals.uz
 */

// ============================================================================
// Brand Types
// ============================================================================

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  category: string;
  isVerified: boolean;
  dealsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Offer/Deal Types
// ============================================================================

export type OfferType = 'discount' | 'voucher' | 'freebie' | 'cashback';
export type OfferFormat = 'online' | 'offline' | 'both';

export interface Offer {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  brand: Brand;
  category: Category;
  type: OfferType;
  format: OfferFormat;
  
  // Pricing
  originalPrice?: number; // in UZS
  discountedPrice?: number; // in UZS
  discountPercentage?: number;
  
  // Availability
  isActive: boolean;
  isStudentOnly: boolean;
  startsAt?: string;
  expiresAt?: string;
  
  // Location
  cities?: string[]; // Tashkent, Samarkand, etc.
  locations?: Location[];
  
  // Redemption
  code?: string; // Promo code
  link?: string; // External link
  instructions?: string;
  
  // Metadata
  views: number;
  saves: number;
  redeems: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
  dealsCount: number;
  order: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Location Types
// ============================================================================

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  hours?: string;
}

// ============================================================================
// University Types
// ============================================================================

export interface University {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  city: string;
  domain?: string; // Email domain for verification
  isVerified: boolean;
}

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'USER' | 'ADMIN';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  emailVerifiedAt?: string;
  
  // Student verification
  university?: University;
  studentId?: string;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string;
  verificationExpiresAt?: string;
  
  // Preferences
  favoriteCategories?: string[];
  savedOffers?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Verification Types
// ============================================================================

export interface VerificationRequest {
  id: string;
  userId: string;
  universityId: string;
  studentId: string;
  documentUrl?: string;
  status: VerificationStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface OfferFilters {
  category?: string;
  brand?: string;
  type?: OfferType;
  format?: OfferFormat;
  city?: string;
  studentOnly?: boolean;
  minDiscount?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: 'newest' | 'popular' | 'expiring' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============================================================================
// SEO Types
// ============================================================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article' | 'product';
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  emailVerifiedAt?: string;
  studentVerifiedAt?: string;
  university?: University;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Feedback Types
// ============================================================================

export interface Feedback {
  id: string;
  email?: string;
  message: string;
  rating?: number;
  page?: string;
  createdAt: string;
}

