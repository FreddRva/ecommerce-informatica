import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CouponService } from '../../../core/services/coupon.service';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-coupons.component.html'
})
export class AdminCouponsComponent {
  couponService = inject(CouponService);

  coupons = this.couponService.coupons;
  showCreateModal = signal(false);

  newCoupon = {
    code: '',
    discountPercent: 10,
    minPurchase: 100,
    validUntil: '2026-12-31',
    isActive: true,
    maxUsage: 100
  };

  createCoupon(): void {
    if (!this.newCoupon.code) return;
    this.couponService.createCoupon(this.newCoupon);
    this.newCoupon = { code: '', discountPercent: 10, minPurchase: 100, validUntil: '2026-12-31', isActive: true, maxUsage: 100 };
    this.showCreateModal.set(false);
  }

  toggle(id: string): void {
    this.couponService.toggleCoupon(id);
  }
}
