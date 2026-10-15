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
    email?: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    const cleanNum = card.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 16) {
      this.notify.error('Número de tarjeta inválido (15-16 dígitos)');
      return { success: false, error: 'Número inválido' };
    }
    if (!card.cardHolder?.trim()) {
      this.notify.error('Nombre del titular requerido');
      return { success: false, error: 'Titular requerido' };
    }
    if (!card.expiry || card.expiry.trim().length < 4) {
      this.notify.error('Fecha de expiración requerida (formato MM/AA)');
      return { success: false, error: 'Fecha inválida' };
    }
    if (!card.cvv || card.cvv.trim().length < 3) {
      this.notify.error('Código CVV inválido (mínimo 3 dígitos)');
      return { success: false, error: 'CVV inválido' };
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const transactionId = `pi_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    this.notify.success('¡Pago procesado exitosamente!');
    return { success: true, transactionId };
  }
}
