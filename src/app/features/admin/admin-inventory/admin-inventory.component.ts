import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-inventory.component.html'
})
export class AdminInventoryComponent {
  productService = inject(ProductService);

  products = this.productService.allProductsAdmin;
  lowStockAlerts = this.productService.lowStockProducts;

  quickAddStock(productId: string, currentStock: number, amount: number): void {
    this.productService.updateStock(productId, currentStock + amount, `Ingreso de lote (+${amount})`);
  }

  setStock(productId: string, newStock: number): void {
    this.productService.updateStock(productId, newStock, 'Ajuste manual');
  }
}
