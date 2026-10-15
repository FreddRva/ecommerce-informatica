import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CouponService } from '../../core/services/coupon.service';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProductCardComponent],
  templateUrl: './offers.component.html'
})

export class OffersComponent {
  couponService = inject(CouponService);
  productService = inject(ProductService);
  notify = inject(NotificationService);

  coupons = this.couponService.coupons;
  discountedProducts = this.productService.products;

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.notify.success(`¡Código ${code} copiado al portapapeles!`);
  }
}
