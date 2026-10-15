import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart.service';
import { CouponService } from '../../core/services/coupon.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cartService = inject(CartService);
  couponService = inject(CouponService);
  router = inject(Router);

  couponInput = signal('');

  items = this.cartService.items;
  subtotal = this.cartService.subtotal;
  discount = this.cartService.discount;
  shipping = this.cartService.shipping;
  total = this.cartService.total;
  appliedCoupon = this.cartService.appliedCoupon;

  updateQty(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  applyCoupon(): void {
    const code = this.couponInput().trim();
    if (!code) return;
    const validated = this.couponService.validateCoupon(code, this.subtotal());
    if (validated) {
      this.cartService.appliedCoupon.set(validated);
      this.couponInput.set('');
    }
  }

  removeCoupon(): void {
    this.cartService.appliedCoupon.set(null);
  }

  proceedToCheckout(): void {
    if (this.cartService.validateStockBeforeCheckout()) {
      this.router.navigate(['/checkout']);
    }
  }
}
