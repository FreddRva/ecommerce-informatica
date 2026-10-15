import { Injectable, signal, inject } from '@angular/core';
import { Review, ProductInquiry } from '../models/review.model';
import { NotificationService } from './notification.service';

const INITIAL_REVIEWS: Review[] = [
  { id: 'rev-1', productId: 'prod-1', userName: 'Sebastián V.', rating: 5, comment: 'Increíble rendimiento. La pantalla Mini-LED a 240Hz tiene colores impresionantes y mueve Cyberpunk en ultra con trazado de rutas sin despeinarse.', verifiedPurchase: true, createdAt: '2025-02-01' },
  { id: 'rev-2', productId: 'prod-2', userName: 'David R.', rating: 5, comment: 'La mejor tarjeta gráfica del mercado. Temperaturas bajísimas incluso a 450W con el disipador masivo.', verifiedPurchase: true, createdAt: '2025-02-04' },
  { id: 'rev-3', productId: 'prod-3', userName: 'Mariana K.', rating: 5, comment: 'La experiencia de 49 pulgadas a 240Hz OLED no tiene comparación. Para productividad y sim-racing es oro puro.', verifiedPurchase: true, createdAt: '2025-02-08' }
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private notify = inject(NotificationService);

  reviews = signal<Review[]>(INITIAL_REVIEWS);
  inquiries = signal<ProductInquiry[]>([]);

  getProductReviews(productId: string): Review[] {
    return this.reviews().filter(r => r.productId === productId);
  }

  addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): void {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.reviews.update(list => [newRev, ...list]);
    this.notify.success('¡Gracias por tu valoración!');
  }

  sendInquiry(data: Omit<ProductInquiry, 'id' | 'status' | 'createdAt'>): void {
    const newInquiry: ProductInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.inquiries.update(list => [newInquiry, ...list]);
    this.notify.success('Consulta enviada. Nuestro equipo técnico te responderá pronto.');
  }
}
