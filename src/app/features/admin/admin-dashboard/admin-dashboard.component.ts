import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { AdminOrdersComponent } from '../admin-orders/admin-orders.component';
import { AdminInventoryComponent } from '../admin-inventory/admin-inventory.component';
import { AdminCouponsComponent } from '../admin-coupons/admin-coupons.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatIconModule,
    AdminProductsComponent, AdminOrdersComponent,
    AdminInventoryComponent, AdminCouponsComponent
  ],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {
  orderService = inject(OrderService);
  productService = inject(ProductService);

  activeTab = signal<'overview' | 'products' | 'orders' | 'inventory' | 'coupons'>('overview');

  totalSales = computed(() => this.orderService.allOrders().reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0));
  totalOrders = computed(() => this.orderService.allOrders().length);
  totalProducts = computed(() => this.productService.allProductsAdmin().length);
  lowStockCount = computed(() => this.productService.lowStockProducts().length);

  // Top products (HU-44)
  topProducts = computed(() => {
    return [...this.productService.allProductsAdmin()]
      .sort((a, b) => b.reviewsCount - a.reviewsCount)
      .slice(0, 4);
  });

  // Recent customers (HU-46)
  recentCustomers = computed(() => {
    const list = this.orderService.allOrders().map(o => ({
      name: o.userName,
      email: o.userEmail,
      city: o.shippingAddress.city,
      total: o.total,
      date: o.createdAt
    }));
    return list.slice(0, 5);
  });
}
