import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent {
  productService = inject(ProductService);

  products = this.productService.allProductsAdmin;
  categories = this.productService.categories;

  showModal = signal(false);
  editingId = signal<string | null>(null);

  form = {
    name: '',
    brand: '',
    slug: '',
    description: '',
    categoryId: 'cat-components',
    price: 99.99,
    originalPrice: 120.00,
    stock: 10,
    minStockAlert: 3,
    images: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    isFeatured: false
  };

  openNew(): void {
    this.editingId.set(null);
    this.form = { name: '', brand: '', slug: '', description: '', categoryId: 'cat-components', price: 99.99, originalPrice: 120, stock: 10, minStockAlert: 3, images: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80', isActive: true, isFeatured: false };
    this.showModal.set(true);
  }

  openEdit(p: Product): void {
    this.editingId.set(p.id);
    this.form = { name: p.name, brand: p.brand, slug: p.slug, description: p.description, categoryId: p.categoryId, price: p.price, originalPrice: p.originalPrice || 0, stock: p.stock, minStockAlert: p.minStockAlert, images: p.images[0] || '', isActive: p.isActive, isFeatured: p.isFeatured };
    this.showModal.set(true);
  }

  saveProduct(): void {
    if (!this.form.name || !this.form.brand) return;
    const slug = this.form.name.toLowerCase().replace(/\s+/g, '-');
    if (this.editingId()) {
      this.productService.updateProduct(this.editingId()!, { ...this.form, slug, images: [this.form.images] });
    } else {
      this.productService.addProduct({ ...this.form, slug, specs: { 'Garantía': '3 Años', 'Condición': 'Nuevo Sellado' }, images: [this.form.images] });
    }
    this.showModal.set(false);
  }

  toggleStatus(id: string): void {
    this.productService.toggleProductStatus(id);
  }
}
