import { Product } from '../models/product.model';

export function mapSupabaseToProduct(d: any): Product {
  return {
    id: d.id,
    name: d.name,
    brand: d.brand,
    slug: d.slug,
    description: d.description,
    categoryId: d.category_id,
    price: Number(d.price),
    originalPrice: d.original_price ? Number(d.original_price) : undefined,
    stock: d.stock,
    minStockAlert: d.min_stock_alert,
    isActive: d.is_active,
    isFeatured: d.is_featured,
    specs: d.specs || {},
    images: d.images || [],
    rating: Number(d.rating || 5),
    reviewsCount: d.reviews_count || 0,
    createdAt: d.created_at
  };
}

export function mapProductToSupabase(p: Product | any) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    slug: p.slug,
    description: p.description,
    category_id: p.categoryId,
    price: p.price,
    original_price: p.originalPrice,
    stock: p.stock,
    min_stock_alert: p.minStockAlert,
    is_active: p.isActive,
    is_featured: p.isFeatured,
    specs: p.specs,
    images: p.images
  };
}
