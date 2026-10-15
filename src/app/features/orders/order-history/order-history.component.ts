import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent {
  orderService = inject(OrderService);
  authService = inject(AuthService);

  orders = computed(() => {
    const user = this.authService.currentUser();
    return user ? this.orderService.getOrdersByUser(user.email) : [];
  });

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
      case 'shipped': return 'bg-cyan-950/60 text-cyan-400 border-cyan-800';
      case 'delivered': return 'bg-blue-950/60 text-blue-400 border-blue-800';
      default: return 'bg-amber-950/60 text-amber-400 border-amber-800';
    }
  }
}
