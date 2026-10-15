export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'stripe' | 'transfer' | 'cash';
export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  userName: string;
  userEmail: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentId?: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}
