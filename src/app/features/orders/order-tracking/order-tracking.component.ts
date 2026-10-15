import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './order-tracking.component.html'
})
export class OrderTrackingComponent implements OnInit {
  id = input.required<string>();
  orderService = inject(OrderService);

  order = signal<Order | undefined>(undefined);

  steps: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'paid', label: 'Pago Confirmado', icon: 'check_circle' },
    { key: 'preparing', label: 'En Preparación / Armado', icon: 'build' },
    { key: 'shipped', label: 'Despachado en Ruta', icon: 'local_shipping' },
    { key: 'delivered', label: 'Entregado al Cliente', icon: 'home' }
  ];

  ngOnInit(): void {
    const o = this.orderService.getOrderById(this.id());
    this.order.set(o);
  }

  isStepCompleted(stepKey: OrderStatus): boolean {
    const orderStatus = this.order()?.status;
    const orderIndex = this.steps.findIndex(s => s.key === orderStatus);
    const stepIndex = this.steps.findIndex(s => s.key === stepKey);
    return stepIndex <= orderIndex;
  }
}
