export interface ProductSpec {
  [key: string]: string | number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minStockAlert: number;
  isActive: boolean;
  isFeatured: boolean;
  specs: ProductSpec;
  images: string[];
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface ProductFilter {
  categoryId?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'popularity' | 'newest';
  inStockOnly?: boolean;
}
