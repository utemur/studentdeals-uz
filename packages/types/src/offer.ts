export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  category: OfferCategory;
  merchant: Merchant;
  images: string[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  isStudentOnly: boolean;
  requirements?: string[];
  terms?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOfferRequest {
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  category: OfferCategory;
  merchantId: string;
  images: string[];
  validFrom: Date;
  validUntil: Date;
  isStudentOnly: boolean;
  requirements?: string[];
  terms?: string[];
}

export interface UpdateOfferRequest {
  title?: string;
  description?: string;
  originalPrice?: number;
  discountPrice?: number;
  category?: OfferCategory;
  images?: string[];
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
  isStudentOnly?: boolean;
  requirements?: string[];
  terms?: string[];
}

export interface Merchant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum OfferCategory {
  FOOD = "food",
  ENTERTAINMENT = "entertainment",
  EDUCATION = "education",
  SHOPPING = "shopping",
  HEALTH = "health",
  TRANSPORT = "transport",
  TECHNOLOGY = "technology",
  OTHER = "other",
}

export interface OfferFilters {
  category?: OfferCategory;
  isStudentOnly?: boolean;
  isActive?: boolean;
  minDiscount?: number;
  maxPrice?: number;
  search?: string;
}
