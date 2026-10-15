import { Injectable, signal, inject } from '@angular/core';
import { Review, ProductInquiry } from '../models/review.model';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private supabase = inject(SupabaseService);
  private notify = inject(NotificationService);

  reviews = signal<Review[]>([]);
  inquiries = signal<ProductInquiry[]>([]);

  constructor() {
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    if (!this.supabase.isConfigured() || !this.supabase.client) return;
    const { data } = await this.supabase.client.from('reviews').select('*');
    if (data?.length) {
      this.reviews.set(data.map((r: any) => ({
        id: r.id, productId: r.product_id, userName: r.user_name, rating: r.rating,
        comment: r.comment, verifiedPurchase: r.verified_purchase, createdAt: r.created_at
      })));
    }
  }

  getProductReviews(productId: string): Review[] {
    return this.reviews().filter(r => r.productId === productId);
  }

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    const newRev: Review = { ...reviewData, id: `rev-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    this.reviews.update(list => [newRev, ...list]);
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('reviews').insert({
        product_id: newRev.productId, user_name: newRev.userName, rating: newRev.rating,
        comment: newRev.comment, verified_purchase: newRev.verifiedPurchase
      });
    }
    this.notify.success('¡Gracias por tu valoración!');
  }

  async sendInquiry(data: Omit<ProductInquiry, 'id' | 'status' | 'createdAt'>): Promise<void> {
    const newInquiry: ProductInquiry = { ...data, id: `inq-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    this.inquiries.update(list => [newInquiry, ...list]);
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.from('inquiries').insert({
        product_id: newInquiry.productId, product_name: newInquiry.productName,
        name: newInquiry.name, email: newInquiry.email, phone: newInquiry.phone, message: newInquiry.message
      });
    }
    this.notify.success('Consulta enviada. Nuestro equipo técnico te responderá pronto.');
  }
}
