import { Injectable, signal, inject } from '@angular/core';
import { Coupon } from '../models/coupon.model';
import { NotificationService } from './notification.service';

const INITIAL_COUPONS: Coupon[] = [
  { id: 'coup-1', code: 'CYBER10', discountPercent: 10, minPurchase: 100, validUntil: '2026-12-31', isActive: true, usageCount: 42, maxUsage: 500 },
  { id: 'coup-2', code: 'GAMER20', discountPercent: 20, minPurchase: 500, validUntil: '2026-12-31', isActive: true, usageCount: 18, maxUsage: 100 },
  { id: 'coup-3', code: 'PROMO50', discountPercent: 15, minPurchase: 1000, validUntil: '2026-12-31', isActive: true, usageCount: 5, maxUsage: 50 }
];

@Injectable({ providedIn: 'root' })
export class CouponService {
  private notify = inject(NotificationService);
  coupons = signal<Coupon[]>(INITIAL_COUPONS);

  validateCoupon(code: string, currentTotal: number): Coupon | null {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons().find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      this.notify.error('El cupón ingresado no existe');
      return null;
    }
    if (!coupon.isActive) {
      this.notify.error('Este cupón ya no está activo');
      return null;
    }
    if (new Date(coupon.validUntil) < new Date()) {
      this.notify.error('El cupón ha expirado');
      return null;
    }
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      this.notify.error('Este cupón ha alcanzado el límite de usos');
      return null;
    }
    if (currentTotal < coupon.minPurchase) {
      this.notify.error(`El pedido mínimo para este cupón es de $${coupon.minPurchase}`);
      return null;
    }
    this.notify.success(`¡Cupón ${coupon.code} aplicado! ${coupon.discountPercent}% de descuento`);
    return coupon;
  }

  createCoupon(newCoupon: Omit<Coupon, 'id' | 'usageCount'>): void {
    const coupon: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      usageCount: 0
    };
    this.coupons.update(list => [coupon, ...list]);
    this.notify.success(`Cupón ${coupon.code} creado exitosamente`);
  }

  toggleCoupon(id: string): void {
    this.coupons.update(list => list.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  }
}
