export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductInquiry {
  id: string;
  productId?: string;
  productName?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'answered';
  createdAt: string;
}
