import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, ProductFilter } from '../models/product.model';
import { Category } from '../models/category.model';
import { INITIAL_PRODUCTS } from './product-data';
import { INITIAL_CATEGORIES } from './category-data';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';
import { mapSupabaseToProduct, mapProductToSupabase } from './supabase-product.helper';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private supabase = inject(SupabaseService);
  private notify = inject(NotificationService);

  private productsState = signal<Product[]>(INITIAL_PRODUCTS);
  categories = signal<Category[]>(INITIAL_CATEGORIES);
  filter = signal<ProductFilter>({ categoryId: 'cat-all', sortBy: 'popularity' });

  products = computed(() => {
    let list = this.productsState().filter(p => p.isActive);
    const f = this.filter();
    if (f.categoryId && f.categoryId !== 'cat-all') list = list.filter(p => p.categoryId === f.categoryId);
    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (f.inStockOnly) list = list.filter(p => p.stock > 0);
    if (f.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (f.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (f.sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    return list;
  });

  allProductsAdmin = computed(() => this.productsState());
  lowStockProducts = computed(() => this.productsState().filter(p => p.stock <= p.minStockAlert));
  featuredProducts = computed(() => this.productsState().filter(p => p.isFeatured && p.isActive));

  constructor() {
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    if (!this.supabase.isConfigured() || !this.supabase.client) return;
    const { data } = await this.supabase.client.from('products').select('*');
    if (data?.length) this.productsState.set(data.map(mapSupabaseToProduct));
  }

  getProductById(id: string): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  setFilter(changes: Partial<ProductFilter>): void {
    this.filter.update(curr => ({ ...curr, ...changes }));
  }

  async addProduct(prod: Omit<Product, 'id' | 'createdAt' | 'reviewsCount' | 'rating'>): Promise<void> {
    const newP: Product = { ...prod, id: `prod-${Date.now()}`, createdAt: new Date().toISOString(), reviewsCount: 0, rating: 5.0 };
    this.productsState.update(list => [newP, ...list]);
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('products').insert(mapProductToSupabase(newP));
    }
    this.notify.success('Producto añadido al catálogo con éxito');
  }

  async updateProduct(id: string, ch: Partial<Product>): Promise<void> {
    this.productsState.update(list => list.map(p => p.id === id ? { ...p, ...ch } : p));
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('products').update({ name: ch.name, brand: ch.brand, price: ch.price, stock: ch.stock, is_active: ch.isActive }).eq('id', id);
    }
    this.notify.success('Producto actualizado correctamente');
  }

  toggleProductStatus(id: string): void {
    const p = this.getProductById(id);
    if (p) this.updateProduct(id, { isActive: !p.isActive });
    this.notify.info('Estado del producto modificado');
  }

  async updateStock(id: string, newStock: number, reason = 'Ajuste de inventario'): Promise<void> {
    const stock = Math.max(0, newStock);
    this.productsState.update(list => list.map(p => p.id === id ? { ...p, stock } : p));
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('products').update({ stock }).eq('id', id);
    }
    this.notify.success(`Stock actualizado (${reason})`);
  }

  reduceStockForOrder(items: { productId: string; quantity: number }[]): void {
    this.productsState.update(list => list.map(p => {
      const match = items.find(i => i.productId === p.id);
      return match ? { ...p, stock: Math.max(0, p.stock - match.quantity) } : p;
    }));
  }
}
