import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, StarRatingComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();
  cartService = inject(CartService);

  get isLowStock(): boolean {
    return this.product().stock > 0 && this.product().stock <= this.product().minStockAlert;
  }

  get isOutOfStock(): boolean {
    return this.product().stock <= 0;
  }

  get discountPercent(): number | null {
    const orig = this.product().originalPrice;
    if (orig && orig > this.product().price) {
      return Math.round(((orig - this.product().price) / orig) * 100);
    }
    return null;
  }

  addToCart(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    if (!this.isOutOfStock) {
      this.cartService.addToCart(this.product(), 1);
    }
  }
}
