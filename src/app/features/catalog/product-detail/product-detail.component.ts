import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatButtonModule, StarRatingComponent],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  id = input.required<string>();
  productService = inject(ProductService);
  cartService = inject(CartService);
  reviewService = inject(ReviewService);
  authService = inject(AuthService);

  product = signal<Product | undefined>(undefined);
  selectedQty = signal(1);
  newRating = signal(5);
  newComment = signal('');
  inquiryMessage = signal('');
  activeTab = signal<'specs' | 'reviews' | 'inquiry'>('specs');

  ngOnInit(): void {
    const prod = this.productService.getProductById(this.id());
    this.product.set(prod);
  }

  get reviews() {
    return this.reviewService.getProductReviews(this.id());
  }

  get specEntries() {
    const p = this.product();
    return p?.specs ? Object.entries(p.specs) : [];
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cartService.addToCart(p, this.selectedQty());
  }

  submitReview(): void {
    if (!this.newComment().trim()) return;
    const user = this.authService.currentUser();
    this.reviewService.addReview({
      productId: this.id(),
      userName: user?.fullName || 'Cliente Verificado',
      rating: this.newRating(),
      comment: this.newComment(),
      verifiedPurchase: true
    });
    this.newComment.set('');
  }

  submitInquiry(): void {
    if (!this.inquiryMessage().trim()) return;
    const user = this.authService.currentUser();
    this.reviewService.sendInquiry({
      productId: this.id(),
      productName: this.product()?.name,
      name: user?.fullName || 'Cliente Interesado',
      email: user?.email || 'consulta@ejemplo.com',
      message: this.inquiryMessage()
    });
    this.inquiryMessage.set('');
  }
}
