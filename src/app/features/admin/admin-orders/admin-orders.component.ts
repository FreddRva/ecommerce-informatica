import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent {
  orderService = inject(OrderService);

  orders = this.orderService.allOrders;
  selectedOrder = signal<Order | null>(null);

  updateStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status);
  }

  viewDetails(order: Order): void {
    this.selectedOrder.set(order);
  }
}
