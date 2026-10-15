import { Injectable, signal, computed, inject } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';
import { INITIAL_ORDERS } from './order-data';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private supabase = inject(SupabaseService);
  private notify = inject(NotificationService);

  private ordersState = signal<Order[]>(INITIAL_ORDERS);
  allOrders = computed(() => this.ordersState());

  getOrdersByUser(email: string): Order[] {
    return this.ordersState().filter(o => o.userEmail.toLowerCase() === email.toLowerCase());
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersState().find(o => o.id === id || o.orderNumber === id);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `CYBER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}-PRO`,
      createdAt: new Date().toISOString()
    };

    this.productService.reduceStockForOrder(newOrder.items.map(i => ({ productId: i.productId, quantity: i.quantity })));
    this.cartService.clearCart();

    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('orders').insert({
        id: newOrder.id, order_number: newOrder.orderNumber, user_name: newOrder.userName,
        user_email: newOrder.userEmail, status: newOrder.status, subtotal: newOrder.subtotal,
        discount: newOrder.discount, shipping_cost: newOrder.shippingCost, total: newOrder.total,
        shipping_address: newOrder.shippingAddress, payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus, stripe_payment_id: newOrder.stripePaymentId,
        tracking_number: newOrder.trackingNumber
      });
    }

    this.ordersState.update(list => [newOrder, ...list]);
    this.notify.success(`¡Pedido ${newOrder.orderNumber} registrado con éxito!`);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.ordersState.update(list => list.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    if (this.supabase.isConfigured() && this.supabase.client) {
      this.supabase.client.from('orders').update({ status }).eq('id', orderId);
    }
    this.notify.info(`Estado del pedido actualizado a: ${status.toUpperCase()}`);
  }
}
