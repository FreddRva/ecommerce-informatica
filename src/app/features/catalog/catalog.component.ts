import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductFilter } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, ProductCardComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {
  productService = inject(ProductService);

  categories = this.productService.categories;
  products = this.productService.products;
  filter = this.productService.filter;

  onSelectCategory(catId: string): void {
    this.productService.setFilter({ categoryId: catId });
  }

  onSortChange(sortBy: ProductFilter['sortBy']): void {
    this.productService.setFilter({ sortBy });
  }

  onToggleStockOnly(inStockOnly: boolean): void {
    this.productService.setFilter({ inStockOnly });
  }

  clearFilters(): void {
    this.productService.setFilter({ categoryId: 'cat-all', search: '', inStockOnly: false, sortBy: 'popularity' });
  }
}
