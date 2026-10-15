import { Injectable, signal, inject } from '@angular/core';
import { Coupon } from '../models/coupon.model';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private supabase = inject(SupabaseService);
  private notify = inject(NotificationService);

  coupons = signal<Coupon[]>([]);

  constructor() {
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    if (!this.supabase.isConfigured() || !this.supabase.client) return;
    const { data } = await this.supabase.client.from('coupons').select('*');
    if (data?.length) {
      this.coupons.set(data.map((c: any) => ({
        id: c.id, code: c.code, discountPercent: Number(c.discount_percent),
        minPurchase: Number(c.min_purchase || 0), validUntil: c.valid_until,
        isActive: c.is_active, usageCount: c.usage_count || 0, maxUsage: c.max_usage
      })));
    }
  }

  validateCoupon(code: string, currentTotal: number): Coupon | null {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons().find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) { this.notify.error('El cupón ingresado no existe'); return null; }
    if (!coupon.isActive) { this.notify.error('Este cupón ya no está activo'); return null; }
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      this.notify.error('El cupón ha expirado'); return null;
    }
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      this.notify.error('Este cupón ha alcanzado el límite de usos'); return null;
    }
    if (currentTotal < coupon.minPurchase) {
      this.notify.error(`El pedido mínimo para este cupón es de $${coupon.minPurchase}`); return null;
    }
    this.notify.success(`¡Cupón ${coupon.code} aplicado! ${coupon.discountPercent}% de descuento`);
    return coupon;
  }

  async createCoupon(newCoupon: Omit<Coupon, 'id' | 'usageCount'>): Promise<void> {
    const coupon: Coupon = { ...newCoupon, id: `coup-${Date.now()}`, code: newCoupon.code.toUpperCase().trim(), usageCount: 0 };
    this.coupons.update(list => [coupon, ...list]);
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('coupons').insert({
        id: coupon.id, code: coupon.code, discount_percent: coupon.discountPercent,
        min_purchase: coupon.minPurchase, valid_until: coupon.validUntil, is_active: coupon.isActive,
        max_usage: coupon.maxUsage
      });
    }
    this.notify.success(`Cupón ${coupon.code} creado exitosamente`);
  }

  async toggleCoupon(id: string): Promise<void> {
    const c = this.coupons().find(x => x.id === id);
    if (!c) return;
    this.coupons.update(list => list.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('coupons').update({ is_active: !c.isActive }).eq('id', id);
    }
  }
}
