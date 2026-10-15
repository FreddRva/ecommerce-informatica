import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { StripeService, StripeCardDetails } from '../../core/services/stripe.service';
import { ShippingAddress, PaymentMethod, ShippingMethod } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatRadioModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  stripeService = inject(StripeService);
  router = inject(Router);

  user = this.authService.currentUser;
  address: ShippingAddress = {
    fullName: this.user()?.fullName || '',
    email: this.user()?.email || '',
    phone: this.user()?.phone || '',
    addressLine: this.user()?.address || '',
    city: '',
    state: '',
    postalCode: ''
  };

  shippingMethod = signal<ShippingMethod>('standard');
  paymentMethod = signal<PaymentMethod>('stripe');
  isProcessing = signal(false);

  cardDetails: StripeCardDetails = {
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  };


  useStripeTestCard(): void {
    this.cardDetails = { cardNumber: '4242 4242 4242 4242', cardHolder: 'TEST STRIPE CARD', expiry: '08/29', cvv: '424' };
  }

  async submitOrder(): Promise<void> {
    if (!this.cartService.validateStockBeforeCheckout()) return;
    this.isProcessing.set(true);

    let stripeId: string | undefined;
    if (this.paymentMethod() === 'stripe') {
      const result = await this.stripeService.processPayment(this.cartService.total(), this.cardDetails);
      if (!result.success) {
        this.isProcessing.set(false);
        return;
      }
      stripeId = result.transactionId;
    }

    const order = await this.orderService.createOrder({
      userId: this.user()?.id,
      userName: this.address.fullName,
      userEmail: this.address.email,
      status: this.paymentMethod() === 'stripe' ? 'paid' : 'pending',
      subtotal: this.cartService.subtotal(),
      discount: this.cartService.discount(),
      shippingCost: this.cartService.shipping(),
      total: this.cartService.total(),
      shippingAddress: this.address,
      shippingMethod: this.shippingMethod(),
      paymentMethod: this.paymentMethod(),
      paymentStatus: this.paymentMethod() === 'stripe' ? 'paid' : 'pending',
      stripePaymentId: stripeId,
      items: this.cartService.items().map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        total: i.product.price * i.quantity,
        image: i.product.images[0]
      }))
    });

    this.isProcessing.set(false);
    this.router.navigate(['/confirmacion-pedido', order.id]);
  }
}
