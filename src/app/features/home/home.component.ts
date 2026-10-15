import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  productService = inject(ProductService);

  featuredProducts = this.productService.featuredProducts;
  categories = this.productService.categories;

  selectCategory(catId: string): void {
    this.productService.setFilter({ categoryId: catId });
  }
}
