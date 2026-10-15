import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Coupon } from '../models/coupon.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private notify = inject(NotificationService);
  private readonly STORAGE_KEY = 'cybertech_cart';

  items = signal<CartItem[]>(this.loadCart());
  appliedCoupon = signal<Coupon | null>(null);

  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
  
  discount = computed(() => {
    const c = this.appliedCoupon();
    return c ? (this.subtotal() * c.discountPercent) / 100 : 0;
  });

  shipping = computed(() => (this.subtotal() > 500 || this.items().length === 0 ? 0 : 25));
  total = computed(() => Math.max(0, this.subtotal() - this.discount() + this.shipping()));

  addToCart(product: Product, quantity = 1): boolean {
    const currentList = this.items();
    const existing = currentList.find(i => i.product.id === product.id);
    const targetQty = (existing?.quantity || 0) + quantity;

    if (targetQty > product.stock) {
      this.notify.error(`Stock insuficiente. Solo hay ${product.stock} unidades de este producto.`);
      return false;
    }

    if (existing) {
      this.items.update(list => list.map(i => i.product.id === product.id ? { ...i, quantity: targetQty } : i));
    } else {
      this.items.update(list => [...list, { product, quantity }]);
    }
    this.saveCart();
    this.notify.success(`¡${product.name} agregado al carrito!`);
    return true;
  }

  updateQuantity(productId: string, quantity: number): boolean {
    if (quantity <= 0) {
      this.removeItem(productId);
      return true;
    }
    const item = this.items().find(i => i.product.id === productId);
    if (!item) return false;

    if (quantity > item.product.stock) {
      this.notify.error(`Stock máximo disponible: ${item.product.stock} unidades`);
      return false;
    }
    this.items.update(list => list.map(i => i.product.id === productId ? { ...i, quantity } : i));
    this.saveCart();
    return true;
  }

  removeItem(productId: string): void {
    this.items.update(list => list.filter(i => i.product.id !== productId));
    this.saveCart();
    this.notify.info('Producto eliminado del carrito');
  }

  clearCart(): void {
    this.items.set([]);
    this.appliedCoupon.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  validateStockBeforeCheckout(): boolean {
    for (const item of this.items()) {
      if (item.quantity > item.product.stock) {
        this.notify.error(`No hay existencias suficientes para ${item.product.name} (Disponibles: ${item.product.stock})`);
        return false;
      }
    }
    return true;
  }

  private saveCart(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
