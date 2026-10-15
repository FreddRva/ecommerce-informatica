import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

export interface StripeCardDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

@Injectable({ providedIn: 'root' })
export class StripeService {
  private notify = inject(NotificationService);
  private publishableKey = environment.stripePublishableKey;

  isStripeReady(): boolean {
    return !!this.publishableKey && this.publishableKey.startsWith('pk_');
  }

  async processPayment(
    amount: number,
    card: StripeCardDetails,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    const cleanNum = card.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 16) {
      this.notify.error('Número de tarjeta inválido en Stripe');
      return { success: false, error: 'Número de tarjeta inválido' };
    }
    if (!card.cardHolder.trim()) {
      this.notify.error('Nombre del titular requerido');
      return { success: false, error: 'Titular de tarjeta requerido' };
    }
    if (!card.expiry || !card.cvv || card.cvv.length < 3) {
      this.notify.error('Fecha de expiración o CVV inválido');
      return { success: false, error: 'Datos de seguridad incompletos' };
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transactionId = `pi_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    return { success: true, transactionId };
  }
}
